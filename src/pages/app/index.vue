<template>
    <section class="todoapp">
        <!-- header -->
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo"
                autofocus
                autocomplete="off"
                placeholder="What needs to be done?"
                v-model="fieldValue"
                @input="handleInputChange"
                @keyup.enter="handleAddTodo">
        </header>
        <!-- main section -->
        <section class="main" v-show="todos.length">
            <input class="toggle-all" id="toggle-all"
                type="checkbox"
                :checked="allChecked"
                @change="toggleAll(!allChecked)">
            <label for="toggle-all"></label>
            <ul class="todo-list">
                <TodoItem
                    v-for="(todo, index) in filteredTodos"
                    :key="index"
                    :todo="todo"/>
            </ul>
        </section>
        <!-- footer -->
        <footer class="footer" v-show="todos.length">
            <span class="todo-count">
                <strong>{{ remaining }}</strong>
                {{ remaining | pluralize('item') }} left
            </span>
            <ul class="filters">
                <li v-for="(val, key) in filters" v-bind:key="key">
                    <a :href="'#/' + key"
                        :class="{ selected: visibility === key }"
                        @click="handleVisibility(key)">{{ key | capitalize }}</a>
                </li>
            </ul>
            <button class="clear-completed"
                v-show="todos.length > remaining"
                @click="clearCompleted">
                Clear completed
            </button>
        </footer>
    </section>
</template>

<style src="./index.scss"></style>
<script src="./app.js"></script>