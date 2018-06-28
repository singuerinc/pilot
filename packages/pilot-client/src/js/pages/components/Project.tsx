import { differenceInCalendarDays, formatDistance } from 'date-fns';
import gql from 'graphql-tag';
import { addIndex, forEach, groupBy, map, prop, range, reverse, sortBy, takeLast } from 'ramda';
import * as React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { Chart } from '../../Chart';
import colors from '../../colors';
import { Branches } from '../../pages/components/Branches';
import { OpenIssues } from '../../pages/components/OpenIssues';
import { OpenPullRequest } from '../../pages/components/OpenPullRequest';
import { ReleaseTagLink } from './ReleaseTagLink';

const QUERY = gql`
  query AllReleases($packageName: String!) {
    allReleases(packageName: $packageName) {
      _id
      date
      type
      version
      tarball
    }
    allReleaseTags(packageName: $packageName) {
      _id
      date
      type
      version
      tarball
    }
  }
`;

const groupByDate = all => {
  const byDay = x => {
    return differenceInCalendarDays(new Date(), new Date(+x.date));
  };

  return groupBy(byDay, all);
};

const getObjLast15 = obj => {
  const copy = {};
  forEach(n => {
    copy[n] = obj[n] || [];
  }, range(0, 30));
  return copy;
};

const mapIndexed = addIndex(map);

const PackageTitle = styled.div`
  span {
    font-size: 1rem;
    margin: 0 6px;
    opacity: 0.2;
  }
`;

export const Project = ({ pkg, name }) => {
  const li = (tag, i) => (
    <li key={i} className="w-50 flex" style={{ height: '82px' }}>
      <div className="self-end">
        <ReleaseTagLink tag={tag} />
        <div className="white-10 f6 pv2 mb2 di">
          {tag.date ? `${formatDistance(new Date(+tag.date), new Date())} ago` : '-'}
        </div>
      </div>
    </li>
  );
  return (
    <Query query={QUERY} variables={{ packageName: pkg }}>
      {({ data, error, loading }) => {
        if (error) return '💩 Oops!';
        if (loading) return 'Loading...';
        const tags = data.allReleaseTags;
        const all = getObjLast15(groupByDate(data.allReleases));
        const allByDate = sortBy(prop('date'), data.allReleases);
        const last15 = reverse(takeLast(15, allByDate));
        const more = Math.max(0, allByDate.length - last15.length);

        return (
          <div className="tag w-100 ph4">
            <PackageTitle className="bb b--dark-gray f2 pb2 fw2 mt3 mb2 white">
              {name}
              <span>{pkg}</span>
            </PackageTitle>
            <div className="w-100">
              <ul className="list ma0 pa0 mb4 flex">{mapIndexed(li, tags)}</ul>
            </div>
            <div className="w-100">
              <Chart data={all} />
            </div>
            <div className="flex mt3">
              <OpenPullRequest />
              <OpenIssues />
              <Branches />
            </div>
            <div className="flex-wrap w-100 mv3">
              <div className="f4 fw4 pv3">Latest versions</div>
              <ul className="list ma0 pa0">
                {mapIndexed(
                  x => (
                    <li>
                      <a href="#" className="link dim white">
                        {x.version}
                      </a>
                    </li>
                  ),
                  last15
                )}
              </ul>
              {more > 15 && <small className="i mt3 db">+{more} versions...</small>}
            </div>
          </div>
        );
      }}
    </Query>
  );
};
