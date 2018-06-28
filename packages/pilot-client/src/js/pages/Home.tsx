import { compose, head, map, prop } from 'ramda';
import * as React from 'react';
import { TagContainer } from '../containers/TagContainer';

const Container = children => (
  <div className="w-100">
    <h1 className="f1 fw1 ph4">Packages</h1>
    <div className="w-100 flex flex-wrap">{children}</div>
  </div>
);

const Home = compose(
  Container,
  map(TagContainer),
  prop('projects')
);

export { Home };
