<template>
  <tr class="border-b dark:border-gray-700">
    <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ task.title }}</th>
    <td class="px-4 py-3 descr">{{ task.description }}</td>
    <td class="px-4 py-3">{{ formatDate(task.dueDate) }}</td>
    <td class="px-4 py-3">
      <div class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
        <div :class="statusClasses">
          {{ task.completed ? 'Completed' : 'Pending' }}
        </div>
      </div>
    </td>
    <td class="px-4 py-4 sm:px-6">
      {{ task.priority }}
    </td>
    <td class="px-4 py-3 flex items-center justify-end">
     <div class="relative" @mouseleave="closeDropdown">
     <button @click="toggleDropdown" class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button"> 
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
        </svg>
      </button>
        <div v-show="isDropdownOpen" class="absolute right-0 z-50 w-44 bg-white rounded divide-y divide-gray-100 shadow">
          <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" :aria-labelledby="`dropdown-${task.id}-button`">
            <li>
              <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="markAsCompleted(task.id)">Выполнено</a>
            </li>
            <li>
              <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="editTask(task)">Редактировать</a>
            </li>
          </ul>
          <div class="py-1">
            <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" @click="deleteTask(task.id)">Удалить</a>
          </div>
        </div>
        </div>
    </td>    
</tr>
</template>

<script>
export default {
  data() {
    return {
      isDropdownOpen: false,
      dropdownStyle: {}
    };
  },
  name: 'TaskItem',
  props: {
    task: Object
  },
  computed: {
  statusClasses() {
    return {
      'text-green-500': this.task.completed,
      'text-red-500': !this.task.completed
    };
  }
},
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      this.$nextTick(() => {
        const button = this.$el.querySelector('button');
        const dropdown = this.$el.querySelector('.absolute');
        if (dropdown && button) {
          const rect = button.getBoundingClientRect();
          const dropdownWidth = dropdown.offsetWidth;
          this.dropdownStyle = {
            top: `${rect.bottom}px`,
            left: `${rect.left - dropdownWidth}px`
          };
        }
      });
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    isActiveDropdown(taskId) {
      return this.activeDropdown === taskId;
    },
    setDropdownPosition(taskId) {
      const button = this.$refs[`dropdownButton-${taskId}`];
      if (button) {
        const rect = button.getBoundingClientRect();
        this.dropdownStyle = {
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.left}px`,
        };
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },
    markAsCompleted(id) {
      this.$emit('update-task-status', id, true);
    },
    editTask(task) {
      this.$emit('edit-task', task);
    },
    deleteTask(id) {
      if (confirm('Are you sure you want to delete this task?')) {
        this.$emit('delete-task', id);
      }
    }
  }
};
</script>
<style>
.descr{
  width: 400px;
}
</style>