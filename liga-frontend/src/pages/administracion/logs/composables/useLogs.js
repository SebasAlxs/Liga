import { ref } from 'vue'

const items = ref([
  {
    id: 1,
    title: 'Flame Dress by Bolman',
    subtitle: 'Tyler Covington',
    image: '',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    price: 4.10,
  },
  {
    id: 2,
    title: 'Hamlet Contemplation',
    subtitle: 'Freddie Carpenter',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    price: 6.30,
  },
  {
    id: 3,
    title: 'Triumphant Awakening',
    subtitle: 'Tyler Covington',
    image: '',
    avatar: '',
    price: 5.00,
  },
  {
    id: 4,
    title: 'Flame Dress by Bolman',
    subtitle: 'Tyler Covington',
    image: '',
    avatar: '',
    price: 4.20,
  },
  {
    id: 5,
    title: 'Hamlet Contemplation',
    subtitle: 'Freddie Carpenter',
    image: '',
    avatar: '',
    price: 5.40,
  },
  {
    id: 6,
    title: 'Triumphant Awakening',
    subtitle: 'Tyler Covington',
    image: '',
    avatar: '',
    price: 5.20,
  },
])

export function useLogs() {
  return {
    items,
  }
}
