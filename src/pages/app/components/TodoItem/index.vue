<template>
    <li class="todo" :class="{ completed: todo.done, editing: editing }">
        <div class="view">
            <input class="toggle"
                type="checkbox"
                :checked="todo.done"
                @change="toggleTodo(todo)">
            <label v-text="todo.text" @dblclick="handleDbClick"></label>
            <button class="destroy" @click="removeTodo(todo)"></button>
        </div>
        <input class="edit"
            v-show="editing"
            v-focus="editing"
            :value="todo.text"
            @keyup.enter="doneEdit"
            @keyup.esc="cancelEdit"
            @blur="doneEdit">
    </li>
</template>

<script src="./TodoItem"></script>