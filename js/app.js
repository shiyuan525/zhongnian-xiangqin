/**
 * 中年相亲网 - 应用程序入口
 * 单页应用（SPA）路由、导航、全局UI管理
 * 所有用户界面文本使用中文
 */
(function () {
  'use strict';

  // =========================================================================
  // 页面路由映射
  // =========================================================================

  /**
   * 页面路由配置
   * 每个路由定义页面ID、标题和加载回调
   */
  var ROUTES = {
    'home': {
      id: 'page-home',
      title: '中年相亲网 - 寻找人生伴侣',
      auth: false
    },
    'dashboard': {
      id: 'page-dashboard',
      title: '个人中心 - 中年相亲网',
      auth: true
    },
    'profile': {
      id: 'page-profile',
      title: '个人资料 - 中年相亲网',
      auth: true
    },
    'matches': {
      id: 'page-matches',
      title: '匹配推荐 - 中年相亲网',
      auth: true
    },
    'search': {
      id: 'page-search',
      title: '搜索会员 - 中年相亲网',
      auth: true
    },
    'messages': {
      id: 'page-messages',
      title: '我的消息 - 中年相亲网',
      auth: true
    },
    'groups': {
      id: 'page-groups',
      title: '兴趣群组 - 中年相亲网',
      auth: true
    },
    'events': {
      id: 'page-events',
      title: '相亲活动 - 中年相亲网',
      auth: true
    },
    'stories': {
      id: 'page-stories',
      title: '成功故事 - 中年相亲网',
      auth: false
    },
    'settings': {
      id: 'page-settings',
      title: '设置 - 中年相亲网',
      auth: true
    },
    'login': {
      id: 'page-login',
      title: '登录 - 中年相亲网',
      auth: false
    },
    'register': {
      id: 'page-register',
      title: '注册 - 中年相亲网',
      auth: false
    },
    'user-detail': {
      id: 'page-user-detail',
      title: '会员详情 - 中年相亲网',
      auth: true
    }
  };

  var App = {
    // 当前页面
    currentPage: 'home',

    // 页面参数
    currentParams: {},

    // 页面历史栈（用于返回）
    pageHistory: [],

    // =========================================================================
    // 初始化
    // =========================================================================

    /**
     * 初始化应用程序
     */
    init: function () {
      console.log('🚀 中年相亲网正在启动...');

      try {
        // 1. 初始化数据存储
        Store.init();

        // 2. 初始化认证模块
        Auth.init();

        // 3. 应用字体缩放
        this.applyFontScale();

        // 4. 设置导航
        this.setupNavigation();

        // 5. 更新授权UI
        this.updateAuthUI();

        // 6. 加载当前页面
        this.loadCurrentPage();

        // 7. 设置全局错误处理
        this._setupErrorHandling();

        // 8. 设置离线支持
        this._setupOfflineSupport();

        // 9. 更新页脚年份
        this._updateFooter();

        console.log('✅ 中年相亲网启动完成');
      } catch (e) {
        console.error('App.init 初始化失败:', e);
        // 显示错误提示
        var body = document.body;
        if (body) {
          var errorDiv = document.createElement('div');
          errorDiv.style.cssText = 'text-align:center;padding:40px;font-size:18px;color:#c33;';
          errorDiv.textContent = '应用加载失败，请刷新页面重试。如果问题持续，请清除浏览器缓存。';
          body.appendChild(errorDiv);
        }
      }
    },

    // =========================================================================
    // 字体缩放
    // =========================================================================

    /**
     * 应用字体缩放设置
     */
    applyFontScale: function () {
      try {
        var scale = Store.getFontScale();
        var scaleValue = '1';
        var sizeClass = 'font-size-normal';

        switch (scale) {
          case 'large':
            scaleValue = '1.25';
            sizeClass = 'font-size-large';
            break;
          case 'xlarge':
            scaleValue = '1.5';
            sizeClass = 'font-size-xlarge';
            break;
          default:
            scaleValue = '1';
            sizeClass = 'font-size-normal';
            break;
        }

        // 设置CSS变量
        document.documentElement.style.setProperty('--font-scale', scaleValue);

        // 更新body类名
        document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
        document.body.classList.add(sizeClass);

        // 设置基础字体大小
        var baseSize = parseFloat(scaleValue) * 16;
        document.documentElement.style.fontSize = baseSize + 'px';

        console.log('🔤 字体缩放: ' + scale + ' (' + scaleValue + 'x)');
      } catch (e) {
        console.error('applyFontScale error:', e);
      }
    },

    // =========================================================================
    // 导航设置
    // =========================================================================

    /**
     * 设置导航事件监听
     */
    setupNavigation: function () {
      try {
        var self = this;

        // 监听所有带有 data-page 属性的链接点击
        document.addEventListener('click', function (e) {
          // 查找最近的带有 data-page 属性的元素
          var target = e.target;
          while (target && target !== document) {
            if (target.hasAttribute && target.hasAttribute('data-page')) {
              e.preventDefault();
              var page = target.getAttribute('data-page');
              var params = {};
              // 收集其他 data-* 属性作为参数
              if (target.dataset) {
                for (var key in target.dataset) {
                  if (target.dataset.hasOwnProperty(key) && key !== 'page') {
                    params[key] = target.dataset[key];
                  }
                }
              }
              self.navigate(page, params);
              return;
            }
            target = target.parentElement;
          }
        });

        // 监听浏览器的后退/前进按钮
        window.addEventListener('popstate', function (e) {
          if (e.state && e.state.page) {
            self._loadPage(e.state.page, e.state.params || {}, false);
          }
        });

        // 监听键盘导航
        document.addEventListener('keydown', function (e) {
          // Alt + 1~9 快速导航到常见页面
          if (e.altKey && !e.ctrlKey && !e.metaKey) {
            var pageMap = {
              '1': 'dashboard',
              '2': 'matches',
              '3': 'search',
              '4': 'messages',
              '5': 'profile',
              '6': 'groups',
              '7': 'events',
              '8': 'stories',
              '9': 'settings'
            };
            var targetPage = pageMap[e.key];
            if (targetPage) {
              e.preventDefault();
              self.navigate(targetPage);
            }
          }
        });

        console.log('🧭 导航系统就绪');
      } catch (e) {
        console.error('setupNavigation error:', e);
      }
    },

    // =========================================================================
    // 页面加载
    // =========================================================================

    /**
     * 根据当前URL加载页面
     */
    loadCurrentPage: function () {
      try {
        // 从URL hash 获取页面，或者使用路径
        var page = 'home';
        var hash = window.location.hash;
        if (hash && hash.length > 1) {
          page = hash.substring(1);
        } else {
          // 从路径推断
          var path = window.location.pathname;
          var fileName = path.split('/').pop().replace('.html', '');
          if (fileName && fileName !== 'index' && fileName !== '') {
            page = fileName;
          }
        }

        // 解析参数
        var params = {};
        var queryIndex = page.indexOf('?');
        if (queryIndex !== -1) {
          var queryStr = page.substring(queryIndex + 1);
          page = page.substring(0, queryIndex);
          var pairs = queryStr.split('&');
          for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (pair.length === 2) {
              params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
          }
        }

        this._loadPage(page, params, false);
      } catch (e) {
        console.error('loadCurrentPage error:', e);
      }
    },

    /**
     * 导航到指定页面
     * @param {string} page - 页面名称
     * @param {Object} params - 页面参数
     */
    navigate: function (page, params) {
      try {
        if (!page) return;
        params = params || {};

        // 检查路由是否存在
        if (!ROUTES[page]) {
          console.warn('未知页面: ' + page + '，跳转到首页');
          page = 'home';
        }

        // 检查是否需要登录
        if (ROUTES[page].auth && !Store.isLoggedIn()) {
          showToast('请先登录后再访问此页面', 'warning');
          this.navigate('login', { redirect: page });
          return;
        }

        // 已登录用户不应访问登录/注册页
        if ((page === 'login' || page === 'register') && Store.isLoggedIn()) {
          this.navigate('dashboard');
          return;
        }

        this._loadPage(page, params, true);
      } catch (e) {
        console.error('navigate error:', e);
        showToast('页面跳转失败', 'error');
      }
    },

    /**
     * 内部页面加载逻辑
     * @param {string} page - 页面名称
     * @param {Object} params - 页面参数
     * @param {boolean} pushState - 是否推入浏览器历史
     * @private
     */
    _loadPage: function (page, params, pushState) {
      try {
        var route = ROUTES[page];
        if (!route) {
          page = 'home';
          route = ROUTES[page];
        }

        // 更新浏览器历史
        if (pushState !== false) {
          var url = '#' + page;
          if (params && Object.keys(params).length > 0) {
            var queryParts = [];
            for (var key in params) {
              if (params.hasOwnProperty(key)) {
                queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
              }
            }
            url += '?' + queryParts.join('&');
          }
          window.history.pushState({ page: page, params: params }, route.title, url);
        }

        // 更新页面标题
        document.title = route.title;

        // 显示/隐藏页面容器
        this._showPageContainer(page);

        // 记录当前页面
        this.currentPage = page;
        this.currentParams = params;

        // 更新导航高亮
        this._updateNavHighlight(page);

        // 更新授权UI
        this.updateAuthUI();

        // 根据页面执行特定的初始化逻辑
        this._initPage(page, params);

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('📄 页面已加载: ' + page, params);
      } catch (e) {
        console.error('_loadPage error:', e);
      }
    },

    /**
     * 显示当前页面的容器，隐藏其他
     * @param {string} page
     * @private
     */
    _showPageContainer: function (page) {
      try {
        // 查找所有页面容器
        var containers = document.querySelectorAll('[data-page-container]');
        var foundTarget = false;

        for (var i = 0; i < containers.length; i++) {
          var container = containers[i];
          var containerPage = container.getAttribute('data-page-container');
          if (containerPage === page) {
            container.style.display = '';
            container.classList.remove('hidden');
            foundTarget = true;
          } else {
            container.style.display = 'none';
            container.classList.add('hidden');
          }
        }

        // 如果没有找到页面容器，可能页面内容直接在 body 中
        if (!foundTarget) {
          // 尝试通过路由ID查找
          var route = ROUTES[page];
          if (route && route.id) {
            var pageEl = document.getElementById(route.id);
            if (pageEl) {
              // 隐藏所有其他候选容器
              for (var rKey in ROUTES) {
                if (ROUTES.hasOwnProperty(rKey) && ROUTES[rKey].id !== route.id) {
                  var otherEl = document.getElementById(ROUTES[rKey].id);
                  if (otherEl) {
                    otherEl.style.display = 'none';
                    otherEl.classList.add('hidden');
                  }
                }
              }
              pageEl.style.display = '';
              pageEl.classList.remove('hidden');
            }
          }
        }
      } catch (e) {
        console.error('_showPageContainer error:', e);
      }
    },

    /**
     * 页面特定的初始化
     * @param {string} page
     * @param {Object} params
     * @private
     */
    _initPage: function (page, params) {
      try {
        switch (page) {
          case 'login':
            this._initLoginPage();
            break;
          case 'register':
            this._initRegisterPage();
            break;
          case 'dashboard':
            this._initDashboardPage();
            break;
          case 'search':
            this._initSearchPage();
            break;
          case 'settings':
            this._initSettingsPage();
            break;
          default:
            // 其他页面不需要特殊初始化
            break;
        }
      } catch (e) {
        console.error('_initPage error for ' + page + ':', e);
      }
    },

    // =========================================================================
    // 页面特定初始化
    // =========================================================================

    /**
     * 初始化登录页面
     * @private
     */
    _initLoginPage: function () {
      try {
        var loginForm = document.getElementById('login-form');
        if (loginForm) {
          Auth.handleLogin(loginForm);
        }

        // 检查是否有重定向参数
        var redirect = getQueryParam('redirect');
        if (redirect) {
          // 保存重定向地址
          storageSet('dating_app_redirect', redirect);
        }
      } catch (e) {
        console.error('_initLoginPage error:', e);
      }
    },

    /**
     * 初始化注册页面
     * @private
     */
    _initRegisterPage: function () {
      try {
        // 设置三步注册流程
        this._setupRegisterSteps();
      } catch (e) {
        console.error('_initRegisterPage error:', e);
      }
    },

    /**
     * 设置注册步骤切换
     * @private
     */
    _setupRegisterSteps: function () {
      try {
        var self = this;
        var currentStep = 1;

        // 步骤按钮
        var nextBtn1 = document.getElementById('reg-step1-next');
        var nextBtn2 = document.getElementById('reg-step2-next');
        var prevBtn2 = document.getElementById('reg-step2-prev');
        var prevBtn3 = document.getElementById('reg-step3-prev');
        var submitBtn = document.getElementById('reg-submit');

        // 步骤容器
        var step1El = document.getElementById('register-step-1');
        var step2El = document.getElementById('register-step-2');
        var step3El = document.getElementById('register-step-3');

        // 进度指示器
        var stepIndicators = document.querySelectorAll('.step-indicator');

        function showStep(step) {
          currentStep = step;
          // 隐藏所有步骤
          if (step1El) { step1El.style.display = step === 1 ? '' : 'none'; step1El.classList.toggle('hidden', step !== 1); }
          if (step2El) { step2El.style.display = step === 2 ? '' : 'none'; step2El.classList.toggle('hidden', step !== 2); }
          if (step3El) { step3El.style.display = step === 3 ? '' : 'none'; step3El.classList.toggle('hidden', step !== 3); }

          // 更新进度指示器
          for (var i = 0; i < stepIndicators.length; i++) {
            var indicatorStep = parseInt(stepIndicators[i].getAttribute('data-step'), 10);
            stepIndicators[i].classList.remove('active', 'completed');
            if (indicatorStep === step) {
              stepIndicators[i].classList.add('active');
            } else if (indicatorStep < step) {
              stepIndicators[i].classList.add('completed');
            }
          }
        }

        // 下一步按钮
        if (nextBtn1) {
          nextBtn1.addEventListener('click', function () {
            var form = document.getElementById('register-form-step1');
            if (!form) return;
            var result = Auth.handleRegister(form, 1);
            if (result.valid) {
              Auth.saveRegisterStep(1, result.data);
              showStep(2);
              showToast('基本信息验证通过，请继续填写', 'success', 2000);
            } else {
              showToast(result.message, 'error');
            }
          });
        }

        if (prevBtn2) {
          prevBtn2.addEventListener('click', function () {
            showStep(1);
          });
        }

        if (nextBtn2) {
          nextBtn2.addEventListener('click', function () {
            var form = document.getElementById('register-form-step2');
            if (!form) return;
            var result = Auth.handleRegister(form, 2);
            if (result.valid) {
              Auth.saveRegisterStep(2, result.data);
              showStep(3);
              showToast('个人信息验证通过，最后一步了', 'success', 2000);
            } else {
              showToast(result.message, 'error');
            }
          });
        }

        if (prevBtn3) {
          prevBtn3.addEventListener('click', function () {
            showStep(2);
          });
        }

        // 提交按钮
        if (submitBtn) {
          submitBtn.addEventListener('click', function () {
            var form = document.getElementById('register-form-step3');
            if (!form) return;
            submitBtn.disabled = true;
            submitBtn.textContent = '正在注册...';

            var result = Auth.handleRegister(form, 3);
            if (result.valid) {
              showToast('注册成功！欢迎加入中年相亲网', 'success');
              setTimeout(function () {
                window.location.href = 'dashboard.html';
              }, 1000);
            } else {
              showToast(result.message, 'error');
              submitBtn.disabled = false;
              submitBtn.textContent = '完成注册';
            }
          });
        }

        // 初始化显示第一步
        showStep(1);
      } catch (e) {
        console.error('_setupRegisterSteps error:', e);
      }
    },

    /**
     * 初始化个人中心页面
     * @private
     */
    _initDashboardPage: function () {
      try {
        var user = Store.getCurrentUser();
        if (!user) {
          App.navigate('login');
          return;
        }

        // 填充用户信息
        setText('dash-name', user.name || '未设置姓名');
        setText('dash-age', calculateAge(user.birthDate) ? calculateAge(user.birthDate) + '岁' : '未知年龄');
        setText('dash-gender', user.gender || '未知');

        var profile = Store.getProfile(user.id);
        if (profile) {
          setText('dash-location', (user.location && user.location.city) ? user.location.city : '未设置');
          setText('dash-education', profile.education || '未设置');
          setText('dash-occupation', profile.occupation || '未设置');
          setText('dash-marital', profile.maritalStatus ? profile.maritalStatus : '未设置');
        }

        // 未读消息数
        var unreadCount = Store.getUnreadCount(user.id);
        var badge = document.getElementById('msg-badge');
        if (badge) {
          if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
            badge.style.display = '';
          } else {
            badge.style.display = 'none';
          }
        }

        // 如果是VIP用户
        if (user.isVip) {
          var vipBadge = document.getElementById('vip-badge');
          if (vipBadge) vipBadge.style.display = '';
        }
      } catch (e) {
        console.error('_initDashboardPage error:', e);
      }
    },

    /**
     * 初始化搜索页面
     * @private
     */
    _initSearchPage: function () {
      try {
        var self = this;

        // 绑定搜索输入框的防抖搜索
        var searchInput = document.getElementById('search-keyword');
        if (searchInput) {
          var debouncedSearch = debounce(function () {
            self._performSearch();
          }, 400);

          searchInput.addEventListener('input', debouncedSearch);
          searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              self._performSearch();
            }
          });
        }

        // 绑定筛选按钮
        var filterBtn = document.getElementById('search-filter-btn');
        if (filterBtn) {
          filterBtn.addEventListener('click', function () {
            self._performSearch();
          });
        }

        // 绑定重置按钮
        var resetBtn = document.getElementById('search-reset-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', function () {
            var form = document.getElementById('search-filter-form');
            if (form) form.reset();
            self._performSearch();
          });
        }

        // 初始加载搜索结果
        this._performSearch();
      } catch (e) {
        console.error('_initSearchPage error:', e);
      }
    },

    /**
     * 执行搜索并渲染结果
     * @private
     */
    _performSearch: function () {
      try {
        var filters = {};
        var keywordEl = document.getElementById('search-keyword');
        var genderEl = document.getElementById('search-gender');
        var ageMinEl = document.getElementById('search-age-min');
        var ageMaxEl = document.getElementById('search-age-max');
        var provinceEl = document.getElementById('search-province');
        var cityEl = document.getElementById('search-city');
        var educationEl = document.getElementById('search-education');
        var incomeEl = document.getElementById('search-income');
        var maritalEl = document.getElementById('search-marital');

        if (keywordEl) filters.keyword = keywordEl.value.trim();
        if (genderEl && genderEl.value) filters.gender = genderEl.value;
        if (ageMinEl && ageMinEl.value) filters.ageMin = parseInt(ageMinEl.value, 10);
        if (ageMaxEl && ageMaxEl.value) filters.ageMax = parseInt(ageMaxEl.value, 10);
        if (provinceEl && provinceEl.value) filters.province = provinceEl.value;
        if (cityEl && cityEl.value) filters.city = cityEl.value;
        if (educationEl && educationEl.value) filters.education = educationEl.value;
        if (incomeEl && incomeEl.value) filters.incomeRange = incomeEl.value;
        if (maritalEl && maritalEl.value) filters.maritalStatus = maritalEl.value;

        if (currentUser) {
          filters.excludeUserId = currentUser.id;
        }

        var results = MatchEngine.search(filters);
        this._renderSearchResults(results);
      } catch (e) {
        console.error('_performSearch error:', e);
      }
    },

    /**
     * 渲染搜索结果
     * @param {Array} results
     * @private
     */
    _renderSearchResults: function (results) {
      try {
        var container = document.getElementById('search-results');
        var countEl = document.getElementById('search-count');

        if (countEl) {
          countEl.textContent = '共找到 ' + (results ? results.length : 0) + ' 位会员';
        }

        if (!container) return;

        if (!results || results.length === 0) {
          container.innerHTML = '<div class="empty-state" style="text-align:center;padding:40px;color:#999;">' +
            '<p style="font-size:48px;margin:0;">📭</p>' +
            '<p>没有找到符合条件的会员</p>' +
            '<p style="font-size:14px;">试试放宽筛选条件吧</p>' +
            '</div>';
          return;
        }

        var html = '<div class="search-results-grid">';
        for (var i = 0; i < results.length; i++) {
          var r = results[i];
          var user = r.user;
          var profile = r.profile;
          var city = (user.location && user.location.city) ? user.location.city : '未知';
          var age = r.age || '未知';
          var education = profile ? (profile.education || '未填写') : '未填写';
          var scoreHtml = '';
          if (r.score > 0) {
            var scoreClass = r.score >= 70 ? 'score-high' : r.score >= 40 ? 'score-mid' : 'score-low';
            scoreHtml = '<span class="match-score ' + scoreClass + '">匹配度 ' + r.score + '%</span>';
          }

          html += '<div class="user-card" data-page="user-detail" data-user-id="' + escapeHtml(user.id) + '" tabindex="0" role="button" aria-label="查看' + escapeHtml(user.name) + '的详细资料">';
          html += '<div class="user-card-avatar">';
          if (user.avatar) {
            html += '<img src="' + escapeHtml(user.avatar) + '" alt="' + escapeHtml(user.name) + '的头像" loading="lazy" />';
          } else {
            html += '<div class="avatar-placeholder">' + (user.gender === '女' ? '👩' : '👨') + '</div>';
          }
          html += '</div>';
          html += '<div class="user-card-info">';
          html += '<h3>' + escapeHtml(user.name) + ' <span class="age">' + age + '岁</span></h3>';
          html += '<p class="location">📍 ' + escapeHtml(city) + '</p>';
          html += '<p class="education">🎓 ' + escapeHtml(education) + '</p>';
          if (profile && profile.occupation) {
            html += '<p class="occupation">💼 ' + escapeHtml(profile.occupation) + '</p>';
          }
          if (profile && profile.maritalStatus) {
            html += '<p class="marital">💝 ' + escapeHtml(profile.maritalStatus) + '</p>';
          }
          html += scoreHtml;
          html += '</div>';
          html += '</div>';
        }
        html += '</div>';

        container.innerHTML = html;
      } catch (e) {
        console.error('_renderSearchResults error:', e);
      }
    },

    /**
     * 初始化设置页面
     * @private
     */
    _initSettingsPage: function () {
      try {
        var self = this;

        // 字体缩放设置
        var fontScaleSelect = document.getElementById('setting-font-scale');
        if (fontScaleSelect) {
          fontScaleSelect.value = Store.getFontScale();
          fontScaleSelect.addEventListener('change', function () {
            Store.setFontScale(this.value);
            self.applyFontScale();
            showToast('字体大小设置已更新', 'success');
          });
        }

        // 字体缩放按钮（无表单场景）
        var fontSizeBtns = document.querySelectorAll('.font-size-btn');
        for (var i = 0; i < fontSizeBtns.length; i++) {
          fontSizeBtns[i].addEventListener('click', function () {
            var scale = this.getAttribute('data-scale');
            if (scale) {
              Store.setFontScale(scale);
              self.applyFontScale();
              showToast('字体大小已切换为：' +
                (scale === 'large' ? '大号' : scale === 'xlarge' ? '特大号' : '标准'), 'success');
            }
          });
        }

        // 退出登录按钮
        var logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function () {
            if (confirm('确定要退出登录吗？')) {
              Auth.logout();
            }
          });
        }

        // 绑定所有退出登录按钮
        var logoutBtns = document.querySelectorAll('.logout-btn');
        for (var j = 0; j < logoutBtns.length; j++) {
          logoutBtns[j].addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) {
              Auth.logout();
            }
          });
        }
      } catch (e) {
        console.error('_initSettingsPage error:', e);
      }
    },

    // =========================================================================
    // UI 更新
    // =========================================================================

    /**
     * 根据认证状态更新UI
     */
    updateAuthUI: function () {
      try {
        var isLoggedIn = Store.isLoggedIn();
        var user = isLoggedIn ? Store.getCurrentUser() : null;

        // 需要登录才能看到的元素
        var authOnlyEls = document.querySelectorAll('.auth-only');
        for (var i = 0; i < authOnlyEls.length; i++) {
          authOnlyEls[i].style.display = isLoggedIn ? '' : 'none';
          if (isLoggedIn) {
            authOnlyEls[i].classList.remove('hidden');
          } else {
            authOnlyEls[i].classList.add('hidden');
          }
        }

        // 未登录时显示的元素
        var guestOnlyEls = document.querySelectorAll('.guest-only');
        for (var j = 0; j < guestOnlyEls.length; j++) {
          guestOnlyEls[j].style.display = !isLoggedIn ? '' : 'none';
          if (!isLoggedIn) {
            guestOnlyEls[j].classList.remove('hidden');
          } else {
            guestOnlyEls[j].classList.add('hidden');
          }
        }

        // 更新用户名显示
        var userNameEls = document.querySelectorAll('.current-user-name');
        for (var k = 0; k < userNameEls.length; k++) {
          userNameEls[k].textContent = (user && user.name) ? user.name : '未登录';
        }

        // 更新头像
        var avatarEls = document.querySelectorAll('.current-user-avatar');
        for (var m = 0; m < avatarEls.length; m++) {
          if (user && user.avatar) {
            avatarEls[m].innerHTML = '<img src="' + escapeHtml(user.avatar) + '" alt="头像" />';
          } else {
            avatarEls[m].textContent = user ? (user.gender === '女' ? '👩' : '👨') : '🔒';
          }
        }

        this.updateHeader();
      } catch (e) {
        console.error('updateAuthUI error:', e);
      }
    },

    /**
     * 更新导航高亮
     * @param {string} currentPage
     * @private
     */
    _updateNavHighlight: function (currentPage) {
      try {
        var navLinks = document.querySelectorAll('[data-page]');
        for (var i = 0; i < navLinks.length; i++) {
          var linkPage = navLinks[i].getAttribute('data-page');
          if (linkPage === currentPage) {
            navLinks[i].classList.add('active', 'nav-active');
            // 如果是子导航，也高亮父级
            var parent = navLinks[i].parentElement;
            if (parent && parent.tagName === 'LI') {
              parent.classList.add('active');
            }
          } else {
            navLinks[i].classList.remove('active', 'nav-active');
            var parent = navLinks[i].parentElement;
            if (parent && parent.tagName === 'LI') {
              parent.classList.remove('active');
            }
          }
        }
      } catch (e) {
        console.error('_updateNavHighlight error:', e);
      }
    },

    /**
     * 更新页面头部
     */
    updateHeader: function () {
      try {
        var isLoggedIn = Store.isLoggedIn();
        var user = isLoggedIn ? Store.getCurrentUser() : null;

        // 更新未读消息计数
        var msgCountEl = document.getElementById('msg-count');
        if (msgCountEl && user) {
          var unread = Store.getUnreadCount(user.id);
          msgCountEl.textContent = unread > 0 ? (unread > 99 ? '99+' : String(unread)) : '';
          msgCountEl.style.display = unread > 0 ? '' : 'none';
        }
      } catch (e) {
        console.error('updateHeader error:', e);
      }
    },

    // =========================================================================
    // 离线支持
    // =========================================================================

    /**
     * 设置离线支持
     * @private
     */
    _setupOfflineSupport: function () {
      try {
        var self = this;

        function updateOnlineStatus() {
          var isOnline = navigator.onLine;
          var indicator = document.getElementById('online-status');

          if (isOnline) {
            if (indicator) {
              indicator.textContent = '🟢 在线';
              indicator.className = 'online-status online';
            }
            // 移除离线提示
            var offlineNotice = document.getElementById('offline-notice');
            if (offlineNotice) {
              offlineNotice.parentNode.removeChild(offlineNotice);
            }
          } else {
            if (indicator) {
              indicator.textContent = '🔴 离线';
              indicator.className = 'online-status offline';
            }
            // 显示离线提示
            if (!document.getElementById('offline-notice')) {
              var notice = document.createElement('div');
              notice.id = 'offline-notice';
              notice.style.cssText = 'background:#fff3cd;color:#856404;text-align:center;' +
                'padding:8px;font-size:14px;position:fixed;top:0;left:0;right:0;z-index:99998;';
              notice.textContent = '⚠️ 您当前处于离线状态，部分功能可能受限。数据将保存在本地。';
              document.body.insertBefore(notice, document.body.firstChild);
            }
          }
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();

        console.log('📶 离线支持就绪');
      } catch (e) {
        console.error('_setupOfflineSupport error:', e);
      }
    },

    // =========================================================================
    // 错误处理
    // =========================================================================

    /**
     * 设置全局错误处理
     * @private
     */
    _setupErrorHandling: function () {
      try {
        var self = this;

        // 全局 JS 错误
        window.addEventListener('error', function (e) {
          console.error('全局错误:', e.message, '文件:', e.filename, '行号:', e.lineno);
          // 只对严重错误显示提示
          if (e.error && e.error instanceof SyntaxError) {
            showToast('页面加载出现错误，请刷新重试', 'error', 5000);
          }
        });

        // Promise 未捕获异常
        window.addEventListener('unhandledrejection', function (e) {
          console.error('未处理的Promise异常:', e.reason);
        });

        console.log('🛡️ 错误处理就绪');
      } catch (e) {
        console.error('_setupErrorHandling error:', e);
      }
    },

    // =========================================================================
    // 页脚
    // =========================================================================

    /**
     * 更新页脚版权年份
     * @private
     */
    _updateFooter: function () {
      try {
        var yearEls = document.querySelectorAll('.copyright-year');
        var currentYear = new Date().getFullYear();
        for (var i = 0; i < yearEls.length; i++) {
          yearEls[i].textContent = currentYear;
        }
      } catch (e) {
        console.error('_updateFooter error:', e);
      }
    },

    // =========================================================================
    // 公共API
    // =========================================================================

    /**
     * 获取当前页面名称
     * @returns {string}
     */
    getCurrentPage: function () {
      return this.currentPage;
    },

    /**
     * 获取当前页面参数
     * @returns {Object}
     */
    getCurrentParams: function () {
      return this.currentParams || {};
    },

    /**
     * 刷新当前页面
     */
    refresh: function () {
      this._loadPage(this.currentPage, this.currentParams, false);
    },

    /**
     * 返回上一页
     */
    goBack: function () {
      if (this.pageHistory.length > 0) {
        var prev = this.pageHistory.pop();
        this._loadPage(prev.page, prev.params, false);
      } else {
        window.history.back();
      }
    }
  };

  // =========================================================================
  // 启动应用
  // =========================================================================

  /**
   * DOM加载完成后初始化应用
   */
  function bootstrap() {
    try {
      App.init();
    } catch (e) {
      console.error('bootstrap 启动失败:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    // DOM已就绪，直接初始化
    bootstrap();
  }

  // 挂载到全局
  window.App = App;

  console.log('✅ app.js 已加载 - 应用程序入口就绪');
})();
