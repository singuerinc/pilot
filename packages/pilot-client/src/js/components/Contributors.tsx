import * as React from 'react';
import styled from 'styled-components';
import colors from '../colors';

const Avatar = styled.div`
  border-radius: 50%;
  background-color: ${colors.latest_a};
  background-image: url('https://api.adorable.io/avatars/32/2@2.io.png');
  border: 2px solid ${colors.latest};
  width: 32px;
  height: 32px;
  margin: 0 3px;
`;

export class Contributors extends React.Component {
  state = {};
  render() {
    return (
      <div className="flex self-end">
        <Avatar />
        <Avatar />
        <Avatar />
      </div>
    );
  }
}
