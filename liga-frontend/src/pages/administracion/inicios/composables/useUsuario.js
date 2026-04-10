import { ref } from 'vue'
import { useQuasar } from 'quasar'

const jobs = ref([
  {
    id: 1,
    date: '20 May, 2024',
    company: 'Amazon',
    title: 'Compras Manager',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    tags: ['Part time', 'Senior level', 'Distant', 'Project work'],
    rate: 250,
    location: 'San Francisco, CA',
    bgColor: '#fdecdf',
  },
  {
    id: 2,
    date: '4 Feb, 2023',
    company: 'Google',
    title: 'Junior UI/UX Designer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    tags: ['Full time', 'Junior level', 'Distant', 'Flexible Schedule'],
    rate: 150,
    location: 'California, CA',
    bgColor: '#d9f6f1',
  },
  {
    id: 3,
    date: '29 Jan, 2023',
    company: 'Dribbble',
    title: 'Senior Motion Designer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ea/Dribbble_logo.svg/2048px-Dribbble_logo.svg.png',
    tags: ['Part time', 'Senior level', 'Full Day', 'Shift work'],
    rate: 260,
    location: 'New York, NY',
    bgColor: '#ece8ff',
  },
  {
    id: 4,
    date: '11 Apr, 2023',
    company: 'Twitter',
    title: 'UX Designer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
    tags: ['Full time', 'Middle level', 'Distant'],
    rate: 120,
    location: 'California, CA',
    bgColor: '#e0f3ff',
  },
  {
    id: 5,
    date: '16 Apr, 2025',
    company: '',
    title: 'UX ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
    tags: ['Full time', 'Middle level', 'Distant'],
    rate: 120,
    location: 'California, CA',
    bgColor: '#e0f3ff',
  },
])

export const useUsuario = () => {
  const botonPag = ref(false)
  const $q = useQuasar()

  const submit = async (data) => {
    if (!data.title || !data.description || !data.salary) {
      $q.notify({
        type: 'negative',
        message: 'Por favor, complete los campos obligatorios (Título, Descripción, Salario).',
        timeout: 2500,
      })
      return { success: false, message: 'Validation failed' }
    }

    // Si todo está bien, podrías hacer algo como:
    jobs.value.push({
      id: jobs.value.length + 1,
      date: new Date().toLocaleDateString(),
      company: data.company || 'Desconocido',
      title: data.title,
      logo: data.logo || '',
      tags: data.tags || [],
      rate: data.salary,
      location: data.location || 'Remoto',
      bgColor: '#ffffff',
    })

    $q.notify({
      type: 'positive',
      message: 'Trabajo agregado exitosamente.',
      timeout: 2500,
    })

    return { success: true }
  }

  return {
    botonPag,
    jobs,
    submit,
  }
}
