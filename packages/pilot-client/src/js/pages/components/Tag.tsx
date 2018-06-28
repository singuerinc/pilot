import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import * as R from 'ramda';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ReleaseTagLink } from './ReleaseTagLink';

const QUERY = gql`
  query AllReleases($packageName: String!) {
    allReleaseTags(packageName: $packageName) {
      _id
      date
      type
      version
    }
  }
`;

interface Props {
  pkg: string;
  name: string;
  preferences;
}

const Title = ({ children, className }: { children; className? }) => (
  <div className={`f2 pv2 fw4 white-10 w-40 ${className}`}>{children}</div>
);

export const Tag = ({ pkg, name }: Props) => (
  <div key={pkg} className="tag w-100 ph4 flex bb b--dark-gray">
    <Query query={QUERY} variables={{ packageName: pkg }}>
      {({ data, error, loading }) => {
        if (error) return <Title>Error!</Title>;
        if (loading) return <Title>Loading...</Title>;

        const { allReleaseTags: tags } = data;
        const link = `/project/${encodeURIComponent(pkg)}`;

        return (
          <React.Fragment>
            <Title className="white">
              <Link to={link} className="link dim">
                {name}
              </Link>
              <span className="f5 mh2 white-20">{pkg}</span>
            </Title>
            <div className="w-60 flex">{R.map(ReleaseTagLink, tags)}</div>
          </React.Fragment>
        );
      }}
    </Query>
  </div>
);
