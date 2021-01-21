import { OpeningRepertoire } from 'corf'

export const repertoire = new OpeningRepertoire()

const tree = localStorage.getItem('repertoire')

if (tree) {
  repertoire.tree = OpeningRepertoire.fromJSON(tree).tree
}
