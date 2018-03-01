import { connect } from 'react-redux'
import WalletConfiguration from '../components/WalletConfiguration'

// const toggleTodo = id => {
//   return {
//     type: 'TOGGLE_TODO',
//     id
//   }
// }
//
// const getVisibleTodos = (todos, filter) => {
//   switch (filter) {
//     case 'SHOW_ALL':
//       return todos
//     case 'SHOW_COMPLETED':
//       return todos.filter(t => t.completed)
//     case 'SHOW_ACTIVE':
//       return todos.filter(t => !t.completed)
//   }
// }
 
const mapStateToProps = state => {
  return {
    config: state.configuration
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    onConfigClick: id => {
      // dispatch(toggleTodo(id))
    }
  }
}
 
const WalletConfigurationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletConfiguration)
 
export default WalletConfigurationContainer
