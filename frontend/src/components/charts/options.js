import { decimalni } from '../../utils/format'

export const BOJA = '#3f45b5'

export const osnovne = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

export const osi = {
  x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8' } },
  y: {
    grid: { color: 'rgba(148, 163, 184, 0.2)' },
    border: { display: false },
    ticks: { color: '#94a3b8', callback: (vrijednost) => decimalni(vrijednost) },
    beginAtZero: true,
  },
}
