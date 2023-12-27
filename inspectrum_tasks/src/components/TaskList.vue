<template>
  <div class="max-w-7xl mx-auto p-4">
    <h1 class="text-xl font-bold mb-4">Список Задач</h1>
   <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div class="w-full md:w-1/2">
                    <form class="flex items-center">
                        <label for="simple-search" class="sr-only">Search</label>
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" v-model="searchQuery" placeholder="Поиск" required="">
                        </div>
                    </form>
                </div>
                <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button @click="showModal = 'add'" type="button" class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                       + Create Task
                    </button>
                    <div class="flex items-center space-x-3 w-full md:w-auto">
                        <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-2 text-gray-400" viewbox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                            </svg>
                            Filter
                            <svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </button>
                        <div id="filterDropdown" class="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                            <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Что фильтруем?</h6>
                            <ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                                <li v-for="(count, status) in filters" :key="status" class="flex items-center">

                                    <input type="checkbox" :id="status" v-model="selectedFilters" :value="status" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label :for="status" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">{{ status }} ({{ count }})</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">Задача</th>
                            <th scope="col" class="px-4 py-3">Описание</th>
                            <th scope="col" class="px-4 py-3">Срок</th>
                            <th scope="col" class="px-4 py-3">Статус</th>
                            <th scope="col" class="px-4 py-3">Приоритет</th>
                            <th scope="col" class="px-4 py-3">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                  <tbody>
                    <task-item
                      v-for="task in paginatedTasks"
                      :key="task.id"
                      :task="task"
                      @delete-task="deleteTask"
                      @edit-task="editTask"
                      @update-task-status="updateTaskStatus"
                    />
                  </tbody>
                </table>
                <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing
                    <span class="font-semibold text-gray-900 dark:text-white">{{ rangeStart }}-{{ rangeEnd }}</span>
                    of
                    <span class="font-semibold text-gray-900 dark:text-white">{{ totalTasks }}</span>
                </span>
                <ul class="inline-flex items-stretch -space-x-px">
                    <li>
                        <a @click.prevent="changePage(currentPage - 1)" href="#" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Previous</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </li>
                    <li v-for="page in totalPages" :key="page">
                        <a @click.prevent="changePage(page)" href="#" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{{ page }}</a>
                    </li>
                    <li>
                        <a @click.prevent="changePage(currentPage + 1)" href="#" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Next</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    </div>
    </section>
    <task-form
      v-if="showModal"
      :taskData="selectedTask"
      @close="showModal = null"
      @task-added="taskAdded"
      @task-updated="taskUpdated"
    />
    </div>
</template>

<script>
import TaskItem from './TaskItem.vue';
import "flowbite/dist/flowbite.min.js";
import TaskForm from './TaskForm.vue';
import api from '@/services/api';

export default {
  components: {
    TaskItem,
    TaskForm
  },
  data() {
    return {
      tasks: [],
      showModal: null,
      selectedTask: null,
      searchQuery: '',
      filters: {
        Completed: 0,
        Pending: 0,
        Medium: 0,
        High: 0,
        Low: 0
      },
      selectedFilters: [],
      currentPage: 1,
      tasksPerPage: 10,
      totalTasks: 0,
    };
  },
  mounted() {
    this.fetchTasks();
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(task => {
        const name = task.name ? task.name.toLowerCase() : '';
        const description = task.description ? task.description.toLowerCase() : '';
        const nameMatches = name.includes(this.searchQuery.toLowerCase());
        const descriptionMatches = description.includes(this.searchQuery.toLowerCase());

        let isStatusVisible = this.selectedFilters.length === 0;
        if (this.selectedFilters.includes('Completed')) {
          isStatusVisible = isStatusVisible || task.completed === 1;
        }
        if (this.selectedFilters.includes('Pending')) {
          isStatusVisible = isStatusVisible || task.completed === 0;
        }

        let isPriorityVisible = this.selectedFilters.length === 0;
        if (task.priority && this.selectedFilters.includes(task.priority)) {
          isPriorityVisible = true;
        }

        return (nameMatches || descriptionMatches) && (isStatusVisible || isPriorityVisible);
      });
    },
    paginatedTasks() {
      const start = (this.currentPage - 1) * this.tasksPerPage;
      const end = start + this.tasksPerPage;
      return this.filteredTasks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTasks.length / this.tasksPerPage);
    },
    rangeStart() {
      return (this.currentPage - 1) * this.tasksPerPage + 1;
    },
    rangeEnd() {
      const end = this.currentPage * this.tasksPerPage;
      return end > this.filteredTasks.length ? this.filteredTasks.length : end;
    }
  },
  methods: {
    fetchTasks() {
      api.getTasks().then(response => {
        this.tasks = response.data;
        this.updateFilterCounts();
        this.totalTasks = this.tasks.length;
      }).catch(error => {
        console.error('Ошибка при получении задач:', error);
      });
    },
    changePage(page) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  },
     taskAdded(newTask) {
      console.log(newTask)
      this.tasks.push(newTask);
      this.showModal = null;
    },
      taskUpdated() {
        console.log('Задача обновлена')
        this.fetchTasks();
        this.showModal = null;
      },
    deleteTask(id) {
      api.deleteTask(id).then(() => {
        this.fetchTasks();
      }).catch(error => {
        console.error('Ошибка при удалении задачи:', error);
      });
    },
    updateTaskStatus(id, completed) {
      api.updateTaskStatus(id, { completed }).then(() => {
        this.fetchTasks();
      }).catch(error => {
        console.error('Ошибка при обновлении статуса задачи:', error);
      });
    },
    editTask(task) {
      this.selectedTask = task;
      this.showModal = 'edit';
    },
    showEditPopup(task) {
      this.selectedTask = task;
      this.showModal = 'edit';
    },
    addTask() {
      this.selectedTask = null;
      this.showModal = 'add';
    },
    updateFilterCounts() {
    this.filters = { Completed: 0, Pending: 0, Medium: 0, High: 0, Low: 0 };
    this.tasks.forEach(task => {
      // Обновление счетчиков статусов
      if (task.completed === 1) {
        this.filters['Completed']++;
      } else {
        this.filters['Pending']++;
      }
      // Обновление счетчиков приоритетов
      if (task.priority && Object.prototype.hasOwnProperty.call(this.filters, task.priority)) {
        this.filters[task.priority]++;
      }
    });
  }
  }
};
</script>