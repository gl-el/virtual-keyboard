import Builder from './element-builder';

export default function generatePage(layout) {
  const body = document.querySelector('body');
  const insert = new Builder('textarea', { class: 'centered textarea' }, body);
  insert.insertElement();
  const boardBuild = new Builder('div', { class: 'centered board' }, body);
  boardBuild.insertElement();
  const description = new Builder('p', { class: 'centered description' }, body, 'Made in Windows. Use Ctrl + Alt, or a click on a special key to change language. Check repo below, to see usage of ES6+ features: let, const, arrow functions, classes.');
  description.insertElement();
  const link = new Builder('a', { class: 'centered description link', href: 'https://github.com/gl-el/virtual-keyboard/tree/development', target: '_blank' }, body, 'REPO');
  link.insertElement();
  layout.forEach((row) => {
    const board = document.querySelector('.board');
    const rowBuild = new Builder('div', { class: 'board__row' }, board);
    const builded = rowBuild.createElement();
    row.forEach((key) => {
      let mode = '';
      let classContent = 'key';
      switch (key) {
        case 'Tab':
          mode = key.toLowerCase();
          classContent += ' key_double';
          break;
        case 'Backspace':
          mode = key.toLowerCase();
          classContent += ' key_long';
          break;
        case 'CapsLock':
          mode = 'caps';
          classContent += ' key_triple key_caps';
          break;
        case 'Enter':
          mode = key.toLowerCase();
          classContent += ' key_long';
          break;
        case 'lang':
          mode = key.toLowerCase();
          classContent += ' key_square';
          break;
        case 'Delete':
          mode = 'del';
          classContent += ' key_square';
          break;
        case 'ShiftLeft':
          mode = 'shift';
          classContent += ' key_long';
          break;
        case 'ShiftRight':
          mode = 'shift';
          classContent += ' key_triple';
          break;
        case 'ArrowUp':
          mode = 'up';
          classContent += ' key_square';
          break;
        case 'ArrowLeft':
          mode = 'left';
          classContent += ' key_square';
          break;
        case 'ArrowRight':
          mode = 'right';
          classContent += ' key_square';
          break;
        case 'ArrowDown':
          mode = 'down';
          classContent += ' key_square';
          break;
        case 'ControlLeft':
        case 'ControlRight':
          mode = 'ctrl';
          classContent += ' key_square';
          break;
        case 'AltLeft':
        case 'AltRigth':
          mode = 'alt';
          classContent += ' key_square';
          break;
        case 'Space':
          classContent += ' key_long';
          break;
        default:
          classContent += ' key_square';
      }
      const btn = new Builder('button', { class: `${classContent}`, 'data-code': `${key}`, 'data-mode': `${mode}` }, builded);
      btn.insertElement();
    });
    board.appendChild(builded);
  });
}
