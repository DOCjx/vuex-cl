export default {
    state: {
        todos: JSON.parse(window.localStorage.getItem('todos-vuejs') || '[]'),
        visibility: 'all',
    },
    mutations: {
        addTodo (state, todo, rootState){
            state.todos.push(todo)
        },
        removeTodo (state, todo) {
            state.todos.splice(state.todos.indexOf(todo), 1);
        },
        editTodo ({todos}, {
            todo,
            text = todo.text,
            done = todo.done
        }){
            todo.text = text;
            todo.done = done;
        },
        setVisibility(state, {payload: {key}}){
            state.visibility = key;
        },
        setResData(state, {payload}){
            state.data = payload;
        }
    }
};