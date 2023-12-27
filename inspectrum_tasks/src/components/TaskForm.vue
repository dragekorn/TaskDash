<template>
  <div id="defaultModal" tabindex="-1" aria-hidden="true" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div class="relative p-4 w-full max-w-2xl h-full md:h-auto mx-auto">
        <div class="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-full sm:max-w-lg" style="padding: 10px 10px 10px 10px;">
          <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode ? 'Edit Task' : 'New Task' }}
            </h3>
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="$emit('close')">
            </button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Задача</label>
                <input v-model="task.title" type="text" id="title" placeholder="Название задачи" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
              </div>
              <div>
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                <textarea v-model="task.description" id="description" placeholder="Подробности задачи" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required></textarea>
              </div>
              <div>
                <label for="dueDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Срок</label>
                <input v-model="task.dueDate" type="date" id="dueDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
              </div>
              <div>
                <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Статус</label>
                <select v-model="task.completed" id="status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                  <option :value="false">Pending</option>
                  <option :value="true">Completed</option>
                </select>
              </div>
              <div>
                <label for="priority" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Приоритет</label>
                <select v-model="task.priority" id="priority" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm" @click="$emit('close')">
                Отменить
              </button>
              <button type="submit" class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


  <script>
  import api from '@/services/api';

  export default {
    name: 'TaskForm',
    props: {
      taskData: Object
    },
    data() {
      return {
        task: this.taskData || { title: '', description: '', dueDate: '', completed: false },
        showModal: false
      };
    },
    computed: {
      isEditMode() {
        return !!this.taskData;
      }
    },
  methods: {
    handleSubmit() {
      const taskToSubmit = {
        ...this.task,
        completed: this.task.completed ? true : false // Убедитесь, что completed имеет булево значение
      };

      if (this.isEditMode) {
        api.updateTask(this.task.id, taskToSubmit).then(() => {
          this.$emit('task-updated');
          this.showModal = false;
        }).catch(error => {
          console.error('Ошибка при обновлении задачи:', error);
        });
    } else {
        api.postTask(taskToSubmit).then(response => {
          console.log(response.data)
          this.$emit('task-added', response.data);
          this.showModal = false;
          this.$emit('close');
        }).catch(error => {
          console.error('Ошибка при добавлении задачи:', error);
        });
        
      }
    }
  }
  };
  </script>