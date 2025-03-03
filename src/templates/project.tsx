import * as React from 'react';

import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import { HeroTitle } from '../components/HeroTitle';
import { Layout } from '../components/Layout';
import { LocationInfo } from '../components/LocationInfo';
import { OpeningTimes } from '../components/OpeningTimes';
import { LocaleType } from '../utils/types';

interface CoverImage {
  childImageSharp: {
    fluid: FluidObject;
  };
}

interface OpeningTime {
  day: string;
  open: string;
  close: string;
}

interface TemplateProps {
  title: string;
  cover: CoverImage;
  openingTimes: OpeningTime[];
  location?: {
    description: string;
    showMap: boolean;
    geo: string;
  };
  html: string;
}

export const ProjectTemplate = (props: TemplateProps) => {
  const { title, cover, openingTimes, location, html } = props;

  const showMap = location && location.showMap;
  const mapText = location && location.description;
  const mapGeo: { coordinates: [number, number] } =
    location && location.geo && JSON.parse(location.geo);
  const mapCoordinates = showMap && mapGeo ? mapGeo.coordinates : null;

  return (
    <>
      <HeroTitle media={cover} title={title} />

      <div className="mx-auto container mt-3">
        <section className="-mx-2 flex flex-row flex-wrap justify-between">
          <article
            className="w-full md:w-1/2 flex-grow bg-white border rounded p-4 mx-2 my-2"
            dangerouslySetInnerHTML={{
              __html: html
            }}
          />
          <aside className="w-full md:w-1/3 mx-2 my-2">
            <div className="flex flex-col">
              <section className="bg-white border rounded p-4 mb-4">
                <OpeningTimes days={openingTimes} />
              </section>
              <section className="bg-white border rounded p-4">
                <LocationInfo text={mapText} position={mapCoordinates} />
              </section>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
};

interface PageProps {
  data: {
    project: {
      fields: {
        slug: string;
        language: LocaleType;
      };
      frontmatter: {
        title: string;
        cover: CoverImage;
        categories: string[];
        openingTimes: OpeningTime[];
        location?: {
          description: string;
          showMap: boolean;
          geo: string;
        };
      };
      html: string;
    };
  };
}

const Project = (props: PageProps) => {
  const {
    data: { project }
  } = props;

  return (
    <Layout language={project.fields.language}>
      <ProjectTemplate
        title={project.frontmatter.title}
        cover={project.frontmatter.cover}
        html={project.html}
        openingTimes={project.frontmatter.openingTimes}
        location={project.frontmatter.location}
      />
    </Layout>
  );
};

export default Project;

export const projectQuery = graphql`
  query ProjectPageQuery($id: String!) {
    project: markdownRemark(id: { eq: $id }) {
      fields {
        slug
        language
      }
      frontmatter {
        title
        cover {
          ...HeroMediaFragment
        }
        categories
        openingTimes {
          day
          open
          close
        }
        location {
          description
          showMap
          geo
        }
      }
      html
    }
  }
`;
