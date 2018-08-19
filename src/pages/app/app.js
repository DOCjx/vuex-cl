import {connect} from '../../connect/';
import module from './module';
import TodoItem from './components/TodoItem/';

export default connect({
    name: 'app',
    components: {
        TodoItem
    },
    data(){
      return {
        fieldValue: '',
        filters: {
            all: todos => todos,
            active: todos => todos.filter(todo => !todo.done),
            completed: todos => todos.filter(todo => todo.done)
        }
      }
    },
    computed: {
      allChecked () {
        return this.todos.every(todo => todo.done)
      },
      filteredTodos () {
        return this.filters[this.visibility](this.todos)
      },
      remaining () {
        return this.todos.filter(todo => !todo.done).length
      }
    },
    methods: {
        toggleAll({state, commit}, done){
            const {todos} = state;
            todos.forEach((todo) => {
                commit('editTodo', { todo, done })
            });
        },
        clearCompleted({state, commit}){
            const {todos} = state;
            todos.filter(todo => todo.done)
                .forEach(todo => {
                  commit('removeTodo', todo)
                });
        },
        addTodo({commit, dispatch}, text){
            commit('addTodo', {
                text,
                done: false
            });
            dispatch({
                type: 'TodoItem/showCombinedProps'
            });
        },
        getModules({commit}, {payload}){
            return fetch('https://gist.githubusercontent.com/mbostock/1044242/raw/3ebc0fde3887e288b4a9979dad446eb434c54d08/flare.json')
                .then(async res => {
                    const data = await res.json();
                    commit({ // 可以在此处将异步数据commit进state也可以在返回之后
                        type: 'setResData',
                        payload: data
                    });
                    return {
                        status: res.statusText,
                        data
                    };
                });
        },
        async handleInputChange({dispatch, state}, e){
            try{
                const {status, data} = await dispatch({ // 也可以使用this调用，dispatch方便调用其它组件的action
                    type: 'app/getModules',
                    payload: this.fieldValue
                });
                // const {status, data} = await this.getModules({
                //     payload: this.fieldValue
                // });
                if(status === 'OK'){
                    console.log(state.data);
                }
            }catch(err){
                console.log(err);
            };
        },
        handleAddTodo({dispatch}, e){
            const text = e.target.value;
            if(text.trim()){
                dispatch('addTodo', text);
            }
            this.fieldValue = '';
        },
        handleVisibility({commit}, key){
            commit({
                type: 'setVisibility',
                payload: {
                    key
                }
            })
        }
    },
    filters: {
        pluralize: (n, w) => n === 1 ? w : (w + 's'),
        capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
    }
})(module);