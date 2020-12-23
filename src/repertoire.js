import { OpeningRepertoire } from 'corf'

const repertoire = new OpeningRepertoire()

repertoire.add({
  line: ['e4', 'e5', 'Nf3', 'Nc6'],
  meta: {}
})

repertoire.add({
  line: ['e4', 'd5', 'exd5', 'Qxd5'],
  meta: {}
})

export default repertoire
