import './styles/main.css';
import renderGameboard from './scripts/ui';
import { gameboardUI } from './scripts/selectors';

renderGameboard(gameboardUI.board);
renderGameboard(gameboardUI.enemyBoard);
