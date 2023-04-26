import './index.html';
import './style.css';
import en from './js/en';
import ru from './js/ru';
import boardLayout from './js/layout';
import generatePage from './js/gen-page';

class Keyboard {
  constructor() {
    this.isShift = false;
    this.isShifted = false;
    this.isCapsed = false;
    this.lang = (localStorage.getItem('userLang') === 'ru') ? ru : en;
  }

  shiftKey(keys) {
    for (let i = 0; i < keys.length; i += 1) {
      if (!keys[i].dataset.code.includes('CapsLock')) {
        const letter = keys[i];
        if (letter.textContent === this.lang[i].symbol) {
          letter.textContent = this.lang[i].shift;
        } else {
          letter.textContent = this.lang[i].symbol;
        }
      }
    }
    if (this.isShifted) {
      this.isShifted = false;
    } else {
      this.isShifted = true;
    }
  }

  capitalizeKeys(keys) {
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i].dataset.code.includes('Key')) {
        const letter = keys[i];
        if (letter.textContent === this.lang[i].symbol) {
          letter.textContent = this.lang[i].shift;
        } else {
          letter.textContent = this.lang[i].symbol;
        }
      }
    }
  }

  checkShift(keys, event) {
    if (!event.shiftKey && !this.isShift) {
      this.shiftKey(keys);
      keys.forEach((key) => key.classList.remove('key_active'));
    }
  }

  setLangStorage() {
    if (this.lang === en) {
      localStorage.setItem('userLang', 'en');
    } else {
      localStorage.setItem('userLang', 'ru');
    }
  }

  getLang() {
    const keys = [...document.querySelectorAll('.key')];
    keys.forEach((key, i) => {
      const btn = key;
      btn.textContent = this.lang[i].symbol;
    });
  }

  changeLang(keys) {
    this.lang = this.lang === en ? ru : en;
    this.setLangStorage();
    for (let i = 0; i < keys.length; i += 1) {
      if (!keys[i].dataset.code.includes('CapsLock')) {
        const key = keys[i];
        key.textContent = this.lang[i].symbol;
        key.dataset.code = this.lang[i].code;
      }
    }
    if (this.isCapsed) this.capitalizeKeys(keys);
    if (this.isShifted) {
      this.shiftKey(keys);
      this.isShifted = true;
    }
  }

  handleClicks(btn, event) {
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    const eventType = event.type;
    const text = document.querySelector('.textarea');
    const keys = [...document.querySelectorAll('.key')];
    const isPressed = (eventType === 'click' || eventType === 'keydown');
    const isSelected = (text.selectionStart !== text.selectionEnd);
    let cursor = text.selectionStart;
    let beforeCursor = '';
    let afterCursor = '';
    if (btn.classList.contains('key')) {
      event.preventDefault();
      beforeCursor = text.value.substring(0, text.selectionStart);
      afterCursor = text.value.substring(text.selectionEnd, text.value.length);
      text.focus();
      const { dataset: { mode } } = btn;
      if ((mode === 'left' || mode === 'backspace') && isPressed) {
        cursor = cursor > 0 ? cursor - 1 : 0;
      } else if ((!mode || mode === 'enter' || mode === 'tab' || mode === 'right') && isPressed) {
        cursor += 1;
      } else if (mode === 'up' && isPressed) {
        cursor = 0;
      } else if (mode === 'down' && isPressed) {
        cursor = text.value.length;
      }

      if (!mode && isPressed && !event.ctrlKey) {
        text.value = beforeCursor + btn.textContent + afterCursor;
      } else if (mode === 'enter' && isPressed) {
        text.value = `${beforeCursor}\n${afterCursor}`;
      } else if (mode === 'backspace' && isPressed) {
        if (isSelected) {
          text.value = `${beforeCursor}${afterCursor}`;
          cursor += 1;
        } else if (afterCursor !== '') {
          text.value = beforeCursor.slice(0, beforeCursor.length - 1) + afterCursor;
        } else {
          text.value = text.value.slice(0, text.value.length - 1);
        }
      } else if (mode === 'caps' && isPressed) {
        this.checkShift(keys, event);
        this.capitalizeKeys(keys, btn);
        btn.classList.toggle('caps_active');
        if (this.isCapsed) {
          this.isCapsed = false;
        } else {
          this.isCapsed = true;
        }
      } else if (mode === 'shift') {
        if (isPressed && !this.isShift) {
          this.isShift = true;
          this.shiftKey(keys);
          btn.classList.add('key_active');
        } else {
          this.isShift = false;
          this.checkShift(keys, event);
        }
      } else if (mode === 'tab' && isPressed) {
        text.value = `${beforeCursor}\t${afterCursor}`;
      } else if (mode === 'left' && eventType === 'click' && !event.ctrlKey) {
        text.selectionStart = cursor;
        text.selectionEnd = cursor;
      } else if (mode === 'del' && isPressed) {
        text.value = beforeCursor + afterCursor.slice(1, afterCursor.length);
      } else if ((event.ctrlKey && event.altKey) || mode === 'lang') {
        this.changeLang(keys);
      }
      text.setSelectionRange(cursor, cursor);
      if (mode !== 'shift' && mode !== 'lang' && this.isShifted) {
        this.isShift = false;
        this.checkShift(keys, event);
      }
    }
  }

  start() {
    generatePage(boardLayout);
    this.getLang();

    document.addEventListener('keydown', (e) => {
      try {
        const key = document.querySelector(`.key[data-code="${e.code}"]`);
        this.handleClicks(key, e);
        key.classList.add('key_active');
        return key;
      } catch (err) {
        return 'no key';
      }
    });

    document.addEventListener('keyup', (e) => {
      try {
        const key = document.querySelector(`.key[data-code="${e.code}"]`);
        this.handleClicks(key, e);
        key.classList.remove('key_active');
        return key;
      } catch (err) {
        return 'no key';
      }
    });

    const board = document.querySelector('.board');
    board.addEventListener('click', (e) => {
      this.handleClicks(e.target, e);
    });
  }
}

const keyboard = new Keyboard();
keyboard.start();
