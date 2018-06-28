import * as React from 'react';
import { isEmpty } from 'ramda';
import styled from 'styled-components';

const Input = styled.input`
  background: inherit;
`;

const InputButton = styled.input``;

interface Props {
  add: (name: string, pkg: string) => {};
}

export class AddProjectForm extends React.Component<Props> {
  state = {
    addName: '',
    addPkg: ''
  };

  handleAddPkg = event => {
    this.setState({
      addPkg: event.target.value
    });
  };

  handleAddName = event => {
    this.setState({
      addName: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { addName: name, addPkg: pkg } = this.state;

    if (isEmpty(name) || isEmpty(pkg)) return;

    this.props.add(name, pkg);

    this.setState({
      addName: '',
      addPkg: ''
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          className="mv4 mr3 pa2 outline moon-gray ba b--near-black"
          type="text"
          placeholder="Name"
          value={this.state.addName}
          onChange={this.handleAddName}
        />
        <Input
          className="mv4 mr3 pa2 outline moon-gray ba b--near-black"
          type="text"
          placeholder="Package"
          value={this.state.addPkg}
          onChange={this.handleAddPkg}
        />
        <InputButton className="bg-red pv2 ph4 dark-red" type="submit" value="Add" />
      </form>
    );
  }
}
