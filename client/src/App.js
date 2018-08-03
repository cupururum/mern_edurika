import React, { Component } from 'react';
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CakeIcon from '@material-ui/icons/Cake';


const TodosQuery = gql`
  {
    todos {
      id
      complete
      text
    }
  }
`

const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`

class App extends Component {
  updateTodo = async todo => {
    await this.props.updateTodo({
        variables: {
          id: todo.id,
          complete: !todo.complete
        },
    update: store => {
      // Read the data from our cache for this query.

      const data = store.readQuery({ query: TodosQuery });
      // Add our comment from the mutation to the end.
      data.todos = data.todos.map(todoX => todoX.id === todo.id ? ({
        ...todo,
        complete: !todo.complete
      }) : todoX)
      // Write our data back to the cache.
      store.writeQuery({ query: TodosQuery, data });
    }
  })
};

  removeTodo = todo => () => {
    // remove todo
  };

  render() {
    const {
      data: {loading, todos}
    } = this.props;

    if(loading) {
      return null
    }

    return (
      <div style={{ display: "flex"}}>
        <div style={{ margine: "auto", width: 400}}>
          <Paper elevation={1}> 

            <List>
                {todos.map(todo => (
                  <ListItem
                    key={todo.id}
                    role={undefined}
                    dense
                    button
                    onClick={() => this.updateTodo()}
                  >
                    <Checkbox
                      checked={todo.complete}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={todo.text} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => this.removeTodo()}>
                        <CakeIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </div>
      </div>
    ) 
  }
}

export default compose(
    graphql(UpdateMutation, {name: "updateTodo"}), 
    graphql(TodosQuery)
  )(App);
