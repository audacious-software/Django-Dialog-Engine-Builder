requirejs.config({
    shim: {
        jquery: {
            exports: "$"
        },
        cookie: {
            exports: "Cookies"
        },
        bootstrap: {
            deps: ["jquery"]
        },
    },
    baseUrl: "/static/dashboard/js/app",
    paths: {
        app: '/static/dashboard/js/app',
        material: "/static/dashboard/js/vendor/material-components-web-11.0.0",
        jquery: "/static/dashboard/js/vendor/jquery-3.4.0.min",
        cookie: "/static/dashboard/js/vendor/js.cookie"
    }
});

requirejs(["material", "cookie", "jquery", "base"], function(mdc, Cookies) {
	const doSearch = function(query) {
		const url = URL.parse(window.location.href)
		url.searchParams.set('limit', select.value)
		url.searchParams.set('offset', '0')
		url.searchParams.set('q', query)

		window.location.href = url.href
	}

	const searchField = mdc.textField.MDCTextField.attachTo(document.getElementById('topbar_search'));

	$('#topbar_search_field').on('keypress', function(eventObj) {
		if (eventObj.which == 13) {
			eventObj.preventDefault();

			doSearch(searchField.value)
		}
	})

	$('#topbar_search_icon').on('click', function(eventObj) {
		doSearch(searchField.value)
	})

	mdc.dataTable.MDCDataTable.attachTo(document.getElementById('dialogs_table'));

	const select = mdc.select.MDCSelect.attachTo(document.querySelector('.mdc-select'));

	const url = URL.parse(window.location.href)

	if (url.searchParams.get('limit') !== null) {
		select.value = url.searchParams.get('limit')
	} else {
		select.value = '25'
	}

	if (url.searchParams.get('q') !== null) {
		searchField.value = url.searchParams.get('q')
	}

	$('.dialog_label').on('click', function(eventObj) {
		eventObj.preventDefault()

		const label = $(this).attr('data-label')

		url.searchParams.set('label', label)

		window.location.href = url.href
	})

	select.listen('MDCSelect:change', () => {
		const url = URL.parse(window.location.href)
		url.searchParams.set('limit', select.value)
		window.location.href = url.href
	});

	const addDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('add_dialog_dialog'));

	const deleteDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('confirm_delete_dialog'));

	const lockDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('lock_delete_dialog'));

	const addDialogName = mdc.textField.MDCTextField.attachTo(document.getElementById('new_dialog_name'));

	$("#fab_add_dialog").click(function(eventObj) {
		addDialogName.value = '';

		$("#new_dialog_clone_id").val("");

		addDialog.open();
	});

	$(".dialog_clone_button").click(function(eventObj) {
		addDialogName.value = $(eventObj.target).data()['cloneName'];

		$("#new_dialog_clone_id").val($(eventObj.target).data()['cloneId']);

		addDialog.open();
	});

	$(".dialog_delete_button").click(function(eventObj) {
		$("#delete_dialog_name").text($(eventObj.target).data()["deleteName"]);
		$("#delete_dialog_id").val($(eventObj.target).data()["deleteId"]);

		deleteDialog.open()
	});

	$(".dialog_lock_button").click(function(eventObj) {
		lockDialog.open();
	});

	deleteDialog.listen('MDCDialog:closed', function(event) {
		action = event.detail['action'];

		if (action == 'close') {

		} else if (action == 'delete') {
			var deleteId = $("#delete_dialog_id").val();

			$.post('/builder/dashboard/delete', {
				'identifier': deleteId
			}, function(data) {
				if (data.message) {
					alert(data.message)
				}

				location.reload();
			});
		}
	});

	addDialog.listen('MDCDialog:closed', function(event) {
		action = event.detail['action'];

		if (action == 'close') {

		} else if (action == 'create') {
			var cloneId = $("#new_dialog_clone_id").val();

			if (cloneId === '') {
				cloneId = 'default'
			}

			$.post('/builder/dashboard/create', {
				'name': addDialogName.value,
				'identifier': cloneId
			}, function(data) {
				if (data.message) {
					alert(data.message)
				}

				location.reload();
			});
		}
	});

	const startDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('start_dialog_dialog'))

	const startDestination = mdc.textField.MDCTextField.attachTo(document.getElementById('session_destination'))
	const startInterruptSeconds = mdc.textField.MDCTextField.attachTo(document.getElementById('dialog_interrupt_seconds'))
	const startPauseSeconds = mdc.textField.MDCTextField.attachTo(document.getElementById('dialog_spacing_internal_seconds'))
	const startTimeoutSeconds = mdc.textField.MDCTextField.attachTo(document.getElementById('dialog_spacing_internal_timeouts'))
	const startVariables = mdc.textField.MDCTextField.attachTo(document.getElementById('dialog_variables'))

	startDialog.listen('MDCDialog:closed', function (event) {
		const action = event.detail.action

		if (action === 'close') {
			// Do nothing else - just close.
		} else if (action === 'start') {
			const startId = $('#start_dialog_id').val()

			$.post('/builder/dashboard/start', {
				destination: startDestination.value,
				identifier: startId,
				interrupt_seconds: startInterruptSeconds.value,
				pause_seconds: startPauseSeconds.value,
				timeout_seconds: startTimeoutSeconds.value,
				dialog_variables: startVariables.value
			}, function(data) {
				if (data.message) {
					alert(data.message)
				}
			})
		}
	})

	$('.dialog_start_button').click(function (eventObj) {
		startDestination.value = ''

		$('#start_dialog_id').val($(eventObj.target).data().startId)

		startDialog.open()
	})

	$('.mdc-data-table__pagination-button').click(function(eventObj) {
		eventObj.preventDefault()

		const url = $(this).attr('data-url')

		window.location.href = url
	})
});