import styled from 'styled-components';
import { copy } from '../../utils';
import colors from '../../colors';
import * as React from 'react';

const classByType = x => (x === 'latest' ? 'white f2 fw3' : 'f4 fw2');

const ReleaseTag = styled.span<{ type: string }>`
  position: relative;
  top: -14px;
  font-size: 9px;
  font-weight: 100;
  font-family: 'Arial';
  padding: 3px 4px;
  color: ${props => colors[props.type]};
  background-color: ${props => colors[`${props.type}_a`]};
  -webkit-font-smoothing: auto;
  letter-spacing: 0.07rem;
`;

export const ReleaseTagLink = tag => (
  <a
    key={tag._id}
    className={`${classByType(tag.type)} pointer fw2 link dim pa2 mr4 dbi`}
    onClick={() => copy(tag.version)}
  >
    {tag.version}{' '}
    <ReleaseTag type={tag.type} className={`f7 lh-copy br1 fw6 ttu black pv1 ph2`}>
      {tag.type}
    </ReleaseTag>
  </a>
);
