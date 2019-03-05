import {connect} from 'store';
import module from './module';

export default connect({
    name: 'TodoItem',
    props: ['todo'],
    data(){
        return {
            editing: false
        };
    },
    directives: {
        focus(el, { value }, { context }){
            if (value) {
                context.$nextTick(() => {
                    el.focus();
                });
            }
        }
    },
    methods: {
        handleDbClick({commit}){
            this.editing = true;
        },
        removeTodo({commit}, todo){
            commit('app/removeTodo', todo);
        },
        toggleTodo({commit}, todo){
            commit('app/editTodo', { todo, done: !todo.done });
        },
        editTodo({commit}, {todo, value}){
            commit('app/editTodo', { todo, text: value });
        },
        doneEdit({dispatch, commit}, e){
            const value = e.target.value.trim();
            const {todo} = this;
            if(!value){
                this.removeTodo(todo);
            }else if(this.editing){
                this.editTodo({
                    todo,
                    value
                });
                this.editing = false;
            }
        },
        cancelEdit({dispatch}, e){
            e.target.value = this.todo.text;
            this.editing = false;
        },
        showCombinedProps({state}){
            console.log(state);
        }
    }
})(module);