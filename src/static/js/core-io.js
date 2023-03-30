ZHONGJYUANA.export = function () {
	var rel = {};
	var vue = ZHONGJYUANA.vue;
	rel.configs = ZHONGJYUANA.util.dataCopy("configs");
	rel.apps = ZHONGJYUANA.util.dataCopy("apps");
	var shortcuts = ZHONGJYUANA.util.dataCopy("shortcuts");
	shortcuts.forEach(function (shortcut) {
		delete shortcut.drag;
		if (shortcut.children) {
			shortcut.children.forEach(function (t) {
				delete t.drag;
			});
		}
	});
	rel.shortcuts = shortcuts;
	var tiles = ZHONGJYUANA.util.dataCopy("tiles");
	tiles.forEach(function (tileGroup) {
		tileGroup.data.forEach(function (t) {
			delete t.moved;
		});
	});
	rel.tiles = tiles;
	var startMenu = ZHONGJYUANA.util.dataCopy("startMenu");
	delete startMenu.open;
	delete startMenu.sidebar.open;
	startMenu.sidebar = startMenu.sidebar.btns;
	var removeMenuAttrOpen = function (item) {
		delete item.open;
		if (item.children) {
			for (var i in item.children) {
				var child = item.children[i];
				removeMenuAttrOpen(child);
			}
		}
	};
	for (var i in startMenu.menu) {
		var item = startMenu.menu[i];
		removeMenuAttrOpen(item);
	}
	rel.startMenu = startMenu;
	return rel;
};

//格式化数据为运行时可用
ZHONGJYUANA.format = function (json) {
	var data = Yuri2.jsonMerge(ZHONGJYUANA._baseData(), json, true);
	for (var i in data.apps) {
		var app = Yuri2.jsonMerge(
			ZHONGJYUANA.util.getAppDataTemplate(),
			data.apps[i]
		);
		data.apps[i] = app;
	}
	data.shortcuts.forEach(function (shortcut) {
		shortcut.drag = { mDown: false, left: 0, top: 0 };
		if (shortcut.children) {
			shortcut.children.forEach(function (t) {
				t.drag = { mDown: false, left: 0, top: 0 };
			});
		}
	});
	data.startMenu.open = false;
	data.startMenu.sidebar = {
		btns: data.startMenu.sidebar,
	};
	data.startMenu.sidebar.open = false;
	var addMenuAttrOpen = function (item) {
		item.open = false;
		if (item.children) {
			for (var i in item.children) {
				var child = item.children[i];
				addMenuAttrOpen(child);
			}
		}
	};
	for (var i in data.startMenu.menu) {
		var item = data.startMenu.menu[i];
		addMenuAttrOpen(item);
	}
	return data;
};
ZHONGJYUANA.import = function (json) {
	ZHONGJYUANA.reset();
	var data = ZHONGJYUANA.format(json);
	var vue = ZHONGJYUANA.vue;
	vue.$set(vue, "apps", data.apps);
	for (var i in data) {
		if (i !== "apps") {
			vue.$set(vue, i, data[i]);
		}
	}
	vue.initRuntime();
};
