/**
 * 中年相亲网 - 工具函数库
 * 提供通用的辅助函数，所有函数挂载到全局作用域
 * 中文用户界面，注重可访问性
 */
(function () {
  'use strict';

  // =========================================================================
  // ID 生成
  // =========================================================================

  /**
   * 生成唯一ID
   * @param {string} prefix - 前缀字符串
   * @returns {string} 唯一标识符
   */
  function generateId(prefix) {
    if (!prefix || typeof prefix !== 'string') {
      prefix = 'id';
    }
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomPart = '';
    var timestamp = Date.now().toString(36);
    for (var i = 0; i < 8; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + '_' + timestamp + '_' + randomPart;
  }
  window.generateId = generateId;

  // =========================================================================
  // 日期与时间
  // =========================================================================

  /**
   * 将日期字符串格式化为中文格式
   * @param {string|Date} dateStr - 日期字符串或Date对象
   * @returns {string} 中文格式日期，如 "2026年6月20日"
   */
  function formatDate(dateStr) {
    try {
      if (!dateStr) return '未知日期';
      var d = dateStr instanceof Date ? dateStr : new Date(dateStr);
      if (isNaN(d.getTime())) return '无效日期';
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    } catch (e) {
      console.error('formatDate error:', e);
      return '日期错误';
    }
  }
  window.formatDate = formatDate;

  /**
   * 从出生日期计算年龄
   * @param {string|Date} birthDateStr - 出生日期
   * @returns {number|null} 年龄，无效时返回null
   */
  function calculateAge(birthDateStr) {
    try {
      if (!birthDateStr) return null;
      var birth = birthDateStr instanceof Date ? birthDateStr : new Date(birthDateStr);
      if (isNaN(birth.getTime())) return null;
      var today = new Date();
      var age = today.getFullYear() - birth.getFullYear();
      var monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 0) return null;
      return age;
    } catch (e) {
      console.error('calculateAge error:', e);
      return null;
    }
  }
  window.calculateAge = calculateAge;

  /**
   * 中文友好的相对时间显示
   * @param {string|Date} dateStr - 日期
   * @returns {string} 相对时间描述
   */
  function relativeTime(dateStr) {
    try {
      if (!dateStr) return '未知时间';
      var d = dateStr instanceof Date ? dateStr : new Date(dateStr);
      if (isNaN(d.getTime())) return '时间错误';
      var now = new Date();
      var diffMs = now - d;
      if (diffMs < 0) return '刚刚';
      var diffSec = Math.floor(diffMs / 1000);
      var diffMin = Math.floor(diffSec / 60);
      var diffHour = Math.floor(diffMin / 60);
      var diffDay = Math.floor(diffHour / 24);
      if (diffSec < 60) return '刚刚';
      if (diffMin < 60) return diffMin + '分钟前';
      if (diffHour < 24) return diffHour + '小时前';
      if (diffDay === 1) return '昨天';
      if (diffDay < 7) return diffDay + '天前';
      if (diffDay < 30) return Math.floor(diffDay / 7) + '周前';
      if (diffDay < 365) return Math.floor(diffDay / 30) + '个月前';
      return Math.floor(diffDay / 365) + '年前';
    } catch (e) {
      console.error('relativeTime error:', e);
      return '时间错误';
    }
  }
  window.relativeTime = relativeTime;

  // =========================================================================
  // XSS 防护
  // =========================================================================

  /**
   * 转义HTML字符以防止XSS攻击
   * @param {string} str - 原始字符串
   * @returns {string} 转义后的安全字符串
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  window.escapeHtml = escapeHtml;

  // =========================================================================
  // DOM 显示/隐藏操作
  // =========================================================================

  /**
   * 显示指定ID的元素
   * @param {string} elId - 元素ID
   */
  function show(elId) {
    try {
      var el = document.getElementById(elId);
      if (el) {
        el.style.display = '';
        el.classList.remove('hidden');
      }
    } catch (e) {
      console.error('show error:', e);
    }
  }
  window.show = show;

  /**
   * 隐藏指定ID的元素
   * @param {string} elId - 元素ID
   */
  function hide(elId) {
    try {
      var el = document.getElementById(elId);
      if (el) {
        el.style.display = 'none';
        el.classList.add('hidden');
      }
    } catch (e) {
      console.error('hide error:', e);
    }
  }
  window.hide = hide;

  /**
   * 切换指定ID元素的显示/隐藏状态
   * @param {string} elId - 元素ID
   */
  function toggle(elId) {
    try {
      var el = document.getElementById(elId);
      if (el) {
        if (el.style.display === 'none' || el.classList.contains('hidden')) {
          show(elId);
        } else {
          hide(elId);
        }
      }
    } catch (e) {
      console.error('toggle error:', e);
    }
  }
  window.toggle = toggle;

  // =========================================================================
  // URL 参数
  // =========================================================================

  /**
   * 获取URL查询参数
   * @param {string} name - 参数名
   * @returns {string|null} 参数值
   */
  function getQueryParam(name) {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    } catch (e) {
      // 降级处理
      try {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(window.location.href);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      } catch (e2) {
        console.error('getQueryParam error:', e2);
        return null;
      }
    }
  }
  window.getQueryParam = getQueryParam;

  // =========================================================================
  // 验证函数
  // =========================================================================

  /**
   * 验证中国手机号码格式
   * @param {string} phone - 手机号码
   * @returns {boolean} 是否有效
   */
  function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // 中国手机号: 1开头，第二位3-9，共11位
    return /^1[3-9]\d{9}$/.test(phone.trim());
  }
  window.isValidPhone = isValidPhone;

  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    // 基础邮箱格式验证
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
  window.isValidEmail = isValidEmail;

  /**
   * 验证密码强度（至少6位）
   * @param {string} password - 密码
   * @returns {{ valid: boolean, message: string }}
   */
  function validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: '请输入密码' };
    }
    if (password.length < 6) {
      return { valid: false, message: '密码长度不能少于6位' };
    }
    if (password.length > 32) {
      return { valid: false, message: '密码长度不能超过32位' };
    }
    return { valid: true, message: '' };
  }
  window.validatePassword = validatePassword;

  // =========================================================================
  // CSS 类操作
  // =========================================================================

  /**
   * 添加CSS类
   * @param {Element|string} el - 元素或元素ID
   * @param {string} className - 类名
   */
  function addClass(el, className) {
    try {
      if (typeof el === 'string') el = document.getElementById(el);
      if (el && el.classList) {
        el.classList.add(className);
      }
    } catch (e) {
      console.error('addClass error:', e);
    }
  }
  window.addClass = addClass;

  /**
   * 移除CSS类
   * @param {Element|string} el - 元素或元素ID
   * @param {string} className - 类名
   */
  function removeClass(el, className) {
    try {
      if (typeof el === 'string') el = document.getElementById(el);
      if (el && el.classList) {
        el.classList.remove(className);
      }
    } catch (e) {
      console.error('removeClass error:', e);
    }
  }
  window.removeClass = removeClass;

  /**
   * 检查元素是否有指定CSS类
   * @param {Element|string} el - 元素或元素ID
   * @param {string} className - 类名
   * @returns {boolean}
   */
  function hasClass(el, className) {
    try {
      if (typeof el === 'string') el = document.getElementById(el);
      if (el && el.classList) {
        return el.classList.contains(className);
      }
      return false;
    } catch (e) {
      console.error('hasClass error:', e);
      return false;
    }
  }
  window.hasClass = hasClass;

  /**
   * 切换CSS类
   * @param {Element|string} el - 元素或元素ID
   * @param {string} className - 类名
   */
  function toggleClass(el, className) {
    try {
      if (typeof el === 'string') el = document.getElementById(el);
      if (el && el.classList) {
        el.classList.toggle(className);
      }
    } catch (e) {
      console.error('toggleClass error:', e);
    }
  }
  window.toggleClass = toggleClass;

  // =========================================================================
  // 内容设置
  // =========================================================================

  /**
   * 安全设置元素的HTML内容
   * @param {string} elId - 元素ID
   * @param {string} html - HTML内容（将自动转义）
   */
  function setHTML(elId, html) {
    try {
      var el = document.getElementById(elId);
      if (el) {
        el.innerHTML = html;
      }
    } catch (e) {
      console.error('setHTML error:', e);
    }
  }
  window.setHTML = setHTML;

  /**
   * 设置元素的文本内容（安全，自动转义）
   * @param {string} elId - 元素ID
   * @param {string} text - 文本内容
   */
  function setText(elId, text) {
    try {
      var el = document.getElementById(elId);
      if (el) {
        el.textContent = text;
      }
    } catch (e) {
      console.error('setText error:', e);
    }
  }
  window.setText = setText;

  /**
   * 获取表单中所有字段的值
   * @param {HTMLFormElement|string} formEl - 表单元素或ID
   * @returns {Object} 表单数据键值对
   */
  function getFormData(formEl) {
    try {
      if (typeof formEl === 'string') formEl = document.getElementById(formEl);
      if (!formEl) return {};
      var formData = new FormData(formEl);
      var data = {};
      formData.forEach(function (value, key) {
        // 如果key已存在，转换为数组
        if (data.hasOwnProperty(key)) {
          if (!Array.isArray(data[key])) {
            data[key] = [data[key]];
          }
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });
      return data;
    } catch (e) {
      console.error('getFormData error:', e);
      return {};
    }
  }
  window.getFormData = getFormData;

  // =========================================================================
  // Toast 消息提示
  // =========================================================================

  /**
   * 显示Toast消息
   * @param {string} message - 消息内容
   * @param {string} type - 类型: 'success', 'error', 'warning', 'info'
   * @param {number} duration - 显示时长（毫秒），默认3000
   */
  function showToast(message, type, duration) {
    try {
      type = type || 'success';
      duration = duration || 3000;
      if (typeof duration !== 'number' || duration < 500) duration = 3000;
      if (message === null || message === undefined) message = '';

      // 创建或复用 toast 容器
      var container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
      }

      var toast = document.createElement('div');
      var bgColor = type === 'success' ? '#4CAF50' :
                    type === 'error' ? '#F44336' :
                    type === 'warning' ? '#FF9800' : '#2196F3';
      toast.style.cssText =
        'padding:12px 20px;border-radius:8px;color:#fff;font-size:16px;' +
        'box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:toastIn 0.3s ease;' +
        'min-width:200px;max-width:400px;word-break:break-word;' +
        'background-color:' + bgColor + ';';

      // 注入动画 keyframes（如果不存在）
      if (!document.getElementById('toast-style')) {
        var styleEl = document.createElement('style');
        styleEl.id = 'toast-style';
        styleEl.textContent =
          '@keyframes toastIn{from{opacity:0;transform:translateX(50px);}to{opacity:1;transform:translateX(0);}}' +
          '@keyframes toastOut{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(50px);}}';
        document.head.appendChild(styleEl);
      }

      toast.textContent = message;
      container.appendChild(toast);

      // 自动移除
      setTimeout(function () {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(function () {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
          // 如果容器为空则移除
          if (container.children.length === 0 && container.parentNode) {
            container.parentNode.removeChild(container);
          }
        }, 300);
      }, duration);
    } catch (e) {
      console.error('showToast error:', e);
    }
  }
  window.showToast = showToast;

  // =========================================================================
  // 防抖函数
  // =========================================================================

  /**
   * 创建防抖函数
   * @param {Function} fn - 要防抖的函数
   * @param {number} delay - 延迟时间（毫秒），默认300
   * @returns {Function} 防抖后的函数
   */
  function debounce(fn, delay) {
    if (typeof fn !== 'function') {
      console.error('debounce: first argument must be a function');
      return function () {};
    }
    delay = (typeof delay === 'number' && delay > 0) ? delay : 300;
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        fn.apply(context, args);
      }, delay);
    };
  }
  window.debounce = debounce;

  // =========================================================================
  // 节流函数
  // =========================================================================

  /**
   * 创建节流函数
   * @param {Function} fn - 要节流的函数
   * @param {number} interval - 间隔时间（毫秒），默认300
   * @returns {Function} 节流后的函数
   */
  function throttle(fn, interval) {
    if (typeof fn !== 'function') {
      console.error('throttle: first argument must be a function');
      return function () {};
    }
    interval = (typeof interval === 'number' && interval > 0) ? interval : 300;
    var lastTime = 0;
    return function () {
      var context = this;
      var args = arguments;
      var now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(context, args);
      }
    };
  }
  window.throttle = throttle;

  // =========================================================================
  // localStorage 操作
  // =========================================================================

  /**
   * 从localStorage获取JSON数据
   * @param {string} key - 存储键名
   * @param {*} defaultVal - 默认值
   * @returns {*} 解析后的数据
   */
  function storageGet(key, defaultVal) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return defaultVal !== undefined ? defaultVal : null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('storageGet error for key "' + key + '":', e);
      return defaultVal !== undefined ? defaultVal : null;
    }
  }
  window.storageGet = storageGet;

  /**
   * 将数据以JSON格式存储到localStorage
   * @param {string} key - 存储键名
   * @param {*} val - 要存储的值
   * @returns {boolean} 是否成功
   */
  function storageSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error('storageSet error for key "' + key + '":', e);
      // 存储空间不足时尝试警告用户
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        showToast('存储空间不足，请清理一些数据', 'warning', 5000);
      }
      return false;
    }
  }
  window.storageSet = storageSet;

  /**
   * 从localStorage移除数据
   * @param {string} key - 存储键名
   */
  function storageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('storageRemove error for key "' + key + '":', e);
    }
  }
  window.storageRemove = storageRemove;

  // =========================================================================
  // 通用辅助函数
  // =========================================================================

  /**
   * 检查值是否为空（null, undefined, 空字符串, 空数组）
   * @param {*} val
   * @returns {boolean}
   */
  function isEmpty(val) {
    if (val === null || val === undefined) return true;
    if (typeof val === 'string' && val.trim() === '') return true;
    if (Array.isArray(val) && val.length === 0) return true;
    if (typeof val === 'object' && Object.keys(val).length === 0) return true;
    return false;
  }
  window.isEmpty = isEmpty;

  /**
   * 安全获取嵌套对象属性
   * @param {Object} obj - 目标对象
   * @param {string} path - 属性路径，如 "user.profile.name"
   * @param {*} defaultVal - 默认值
   * @returns {*}
   */
  function getNested(obj, path, defaultVal) {
    try {
      if (!obj || !path) return defaultVal;
      var keys = path.split('.');
      var current = obj;
      for (var i = 0; i < keys.length; i++) {
        if (current === null || current === undefined) return defaultVal;
        current = current[keys[i]];
      }
      return current !== undefined ? current : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }
  window.getNested = getNested;

  /**
   * 判断是否为有效的中国身份证号（18位）
   * @param {string} idCard - 身份证号
   * @returns {boolean}
   */
  function isValidIdCard(idCard) {
    if (!idCard || typeof idCard !== 'string') return false;
    // 18位身份证格式验证
    if (!/^\d{17}[\dXx]$/.test(idCard.trim())) return false;
    // 出生日期验证
    var birth = idCard.substring(6, 14);
    var year = parseInt(birth.substring(0, 4), 10);
    var month = parseInt(birth.substring(4, 6), 10);
    var day = parseInt(birth.substring(6, 8), 10);
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    return true;
  }
  window.isValidIdCard = isValidIdCard;

  /**
   * 随机打乱数组（Fisher-Yates算法）
   * @param {Array} arr
   * @returns {Array} 新数组
   */
  function shuffle(arr) {
    if (!Array.isArray(arr)) return [];
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }
  window.shuffle = shuffle;

  /**
   * 获取当前时间戳（ISO格式字符串）
   * @returns {string}
   */
  function nowISO() {
    return new Date().toISOString();
  }
  window.nowISO = nowISO;

  /**
   * 简单密码哈希（仅用于演示，生产环境应使用bcrypt等）
   * @param {string} password
   * @returns {string} 哈希后的密码
   */
  function simpleHash(password) {
    if (!password) return '';
    // 简单的哈希（仅用于演示，不可用于生产环境）
    var hash = 0;
    var salt = 'zqhw_2026';
    var input = salt + password + salt.split('').reverse().join('');
    for (var i = 0; i < input.length; i++) {
      var char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'zh_' + Math.abs(hash).toString(36) + '_' + input.length.toString(36);
  }
  window.simpleHash = simpleHash;

  console.log('✅ utils.js 已加载 - 工具函数库就绪');
})();
