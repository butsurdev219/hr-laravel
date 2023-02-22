var dataTableRecruit;
var currentKeyword;
var currentJobSeeker;
var currentSearchDate;
var currentStatus = 5;
var currentSort = 1; // 1: Desc, 2:Asc
var g_paginationClicked = false;

jQuery(function($){

	function ensureValue(value) {
		return value == null ? ' ' : value;
	}

	function getRenderString(data, date, refusalDate, notAdoptedDate) {
		if (data == null) return 'ー';
		switch(data) {
			case 1:
				return '<div class="padding-box"><p><em class="green">〇</em>&nbsp内定</p><span>' + ensureValue(date) + '</span></div>';
			case 2:
				return '<div class="padding-box"><p><em class="green">〇</em>&nbsp通過</p><span>' + ensureValue(date) + '</span></div>';
			case 3:
				return '<div class="padding-box"><p><em class="gray">✖</em>&nbsp辞退</p><span>' + ensureValue(refusalDate) + '</span></div>';
			case 4:
				return '<div class="padding-box"><p><em class="gray">✖</em>&nbsp不採用</p><span>' + ensureValue(notAdoptedDate) + '</span></div>';
			case 5:
				return '<div class="first-line"><p class="red">！要対応</p></div><div class="second-line bg-blue">面談日程<br>未確定</div>';
			case 7:
				return '<div class="first-line"><p class="red">！要対応</p></div><div class="second-line bg-blue">選考結果<br>未送付</div>';
			default:
				return '<div class="padding-box"><p>面談設定済み</p></div>';
		}
	}

	// デフォルトの設定を変更
    $.extend( $.fn.dataTable.defaults, {
        language: {
            url: "/assets/datatables_js.json"
        }
    });

    dataTableRecruit = $("#dataTable-apply").DataTable({
		ajax: {
            url: g_baseURL + "/agent/apply/datatable",
            type: 'post',
			data: function(data, settings) {
				data.extra = {
					job_seeker : currentJobSeeker,
					keyword : currentKeyword,
                    search_date: currentSearchDate,
					status: currentStatus,
					order: $(".sort_recruit").val(),
				}
			},
			"dataSrc": function ( json ) {
                $("#status_count").html(json.statusCountHtml);
                return json.data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        },
		processing: true,
        serverSide: true,
        autoWidth: false,
		scrollX: true,
        bSort : false,
        searching: false,
		"bLengthChange": false,
        pageLength: 50,
        sPaginationType: "full_numbers_no_ellipses",
        columnDefs: [
            {
                "targets": 0,
				orderable: false,
                "render": function ( data, type, row, meta ) {
					return '<a href="#/jobseeker/recruit/' + row.job_seeker_id + '"><p>' + row.last_name + row.first_name + '</p><span>' + row.birthday + '歳／' + row.sex + '<span></a>';
                }
            },
			{
                "targets": 1,
                "render": function ( data, type, row, meta ) {
					return '<a href="#/company/recruit/' + row.recruit_company_id + '">' + row.name + '</a>';
                }
            },
			{
                "targets": 2,
                "render": function ( data, type, row, meta ) {
					return '<div class="padding-box" data-id="' + row.id +'">'
                        + '<a href="#/job/' + row.recruit_offer_info_id + '">' + row.job_title + '</a><br>'
                        + '<a class="link-detail" href="' + g_baseURL + '/company/recruit/' + row.id + '">' + row.occupation_category_1 + '</a></div>';
                }
            },
			{
                "targets": 3,
                "render": function ( data, type, row, meta ) {
					return data != 1 ? '' : '<div class="padding-box"><p><em class="green">〇</em>&nbsp;応募</p><span>' + ensureValue(row.application_date) + '</span></div>';
                }
            },
			{
				"targets": 4,
				"render": function ( data, type, row, meta ) {
				    if (data == null) {
                        return row.last_selection_flow_number > 2 ? 'ー' : '';
                    }
					if (data == 1) return '<div class="padding-box"><p><em class="green">〇</em>&nbsp;確認済</p><span>' + ensureValue(row.document_confirmation_date) + '</span></div>';
					return '<div class="first-line"><p class="red">！要対応</p></div><div class="second-line bg-blue">書類<br>未確認</div>';
				}
			},
			{
				"targets": 5,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 3 ? 'ー' : '';
                    }
					switch(data) {
						case 1:
							return '<div class="padding-box"><p><em class="green">〇</em>&nbsp内定</p><span>' + ensureValue(row.applicant_screening_date) + '</span></div>';
						case 2:
							return '<div class="padding-box"><p><em class="green">〇</em>&nbsp通過</p><span>' + ensureValue(row.applicant_screening_date) + '</span></div>';
						case 3:
							return '<div class="padding-box"><p><em class="gray">✖</em>&nbsp辞退</p><span>' + ensureValue(row.applicant_screening_refusal_reason_date) + '</span></div>';
						case 4:
							return '<div class="padding-box"><p><em class="gray">✖</em>&nbsp不採用</p><span>' + ensureValue(row.applicant_screening_not_adopted_date) + '</span></div>';
						default:
							return '<div class="first-line"><p class="red">！要対応</p></div><div class="second-line bg-blue">書類<br>未確認</div>';
					}
				}
			},
			{
				"targets": 6,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 4 ? 'ー' : '';
                    }
                    switch(data) {
						case 1:
							return '<div class="padding-box"><p><em class="green">〇</em>&nbsp内定</p><span>' + ensureValue(row.writing_web_test_date) + '</span></div>';
						case 2:
							return '<div class="padding-box"><p><em class="green">〇</em>&nbsp通過</p><span>' + ensureValue(row.writing_web_test_date) + '</span></div>';
						case 3:
							return '<div class="padding-box"><p><em class="gray">✖</em>&nbsp辞退</p><span>' + ensureValue(row.writing_web_test_refusal_reason_date) + '</span></div>';
						case 4:
							return '<div class="padding-box"><p><em class="gray">✖</em>&nbsp不採用</p><span>' + ensureValue(row.writing_web_test_not_adopted_date) + '</span></div>';
						case 5:
							return '<div class="first-line"><p class="red">！要対応</p></div><div class="second-line bg-blue">日程<br>未確定</div>';
						case 7:
							return '<div class="first-line"><p class="red">！要対応</p></div><div class="second-line bg-blue">選考結果<br>未送付</div>';
						default:
							return '<div class="padding-box"><p>日程<br>設定済み</p></div>';
					}
				}
			},
			{
				"targets": 7,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 5 ? 'ー' : '';
                    }
                    return getRenderString(data, row['interview_date'], row['interview_refusal_reason_date'], row['interview_not_adopted_date']);
				}
			},
			{
				"targets": 8,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 6 ? 'ー' : '';
                    }
                    return getRenderString(data, row['1st_interview_date'], row['1st_refusal_reason_date'], row['1st_not_adopted_date']);
				}
			},
			{
				"targets": 9,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 7 ? 'ー' : '';
                    }
                    return getRenderString(data, row['2nd_interview_date'], row['2nd_refusal_reason_date'], row['2nd_not_adopted_date']);
				}
			},
			{
				"targets": 10,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 8 ? 'ー' : '';
                    }
                    return getRenderString(data, row['3rd_interview_date'], row['3rd_refusal_reason_date'], row['3rd_not_adopted_date']);
				}
			},
			{
				"targets": 11,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 9 ? 'ー' : '';
                    }
                    return getRenderString(data, row['4th_interview_date'], row['4th_refusal_reason_date'], row['4th_not_adopted_date']);
				}
			},
			{
				"targets": 12,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 10 ? 'ー' : '';
                    }
                    return getRenderString(data, row['5th_interview_date'], row['5th_refusal_reason_date'], row['5th_not_adopted_date']);
				}
			},
			{
				"targets": 13,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 11 ? 'ー' : '';
                    }
                    return getRenderString(data, row['last_interview_date'], row['last_refusal_reason_date'], row['last_not_adopted_date']);
				}
			},
			{
				"targets": 14,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 12 ? 'ー' : '';
                    }
                    switch(data) {
						case 1:
							return '<div class="padding-box"><p>入社予定日</p><span class="bold">' + ensureValue(row.recruitment_date) + '</span></div>';
						case 2:
							return '<div class="first-line"><p class="red">！要対応</p></div><div class="second-line bg-blue">入社条件<br>提示・交渉</div>';
						default:
							return '<div class="padding-box"><p>入社条件<br>返答待ち</p></div>';
					}
				}
			},
			{
				"targets": 15,
				"render": function ( data, type, row, meta ) {
                    if (data == null) {
                        return row.last_selection_flow_number > 13 ? 'ー' : '';
                    }
                    switch(data) {
						case 1:
							return '<div class="padding-box"><p class="bold"><em class="orange">〇</em>&nbsp;入社</p><span>' + ensureValue(row.joining_confirmation_date) + '</span></div>';
						case 2:
							return '<div class="padding-box"><p class="bold"><em class="gray">✖</em>&nbsp;辞退</p><span>' + ensureValue(row.joining_confirmation_refusal_reason_date) + '</span></div>';
						default:
							return '<div class="padding-box"><p class="bold"><em class="gray">✖</em>&nbsp;不採用</p><span>' + ensureValue(row.joining_confirmation_not_adopted_date) + '</span></div>';
					}
				}
			},
        ],
        columns: [
            {data: 'name'},
			{data: 'recruit_company'},
			{data: 'job_title'},
			{data: 'application'},
			{data: 'document_confirmation'},
			{data: 'applicant_screening'},
			{data: 'writing_web_test'},
			{data: 'interview'},
			{data: '1st_interview'},
			{data: '2nd_interview'},
			{data: '3rd_interview'},
			{data: '4th_interview'},
			{data: '5th_interview'},
			{data: 'last_interview'},
			{data: 'recruitment'},
			{data: 'joining_confirmation'},
        ]
    });

	dataTableRecruit.on('page.dt', function(){
		var info = dataTableRecruit.page.info();
		console.log( 'Showing page: '+info.page+' of '+info.pages );
		g_paginationClicked = true;
		window.scrollTo(0,document.body.scrollHeight);
	});

	dataTableRecruit.on( 'draw', function () {
		if (g_paginationClicked == true) {
			g_paginationClicked = false;
			window.scrollTo(0,document.body.scrollHeight);
		}

		$('#dataTable-recruit tbody td').each(function(i) {
			var index = dataTableRecruit.cell( this ).index();
			var obj = $(this);

			if (obj.find('div').length && index.column > 2) {
				$(this).css('cursor', 'pointer');
			}
		});
	});

    $.fn.DataTable.ext.pager.full_numbers_no_ellipses = function(page, pages){
        var numbers = [];
        var buttons = $.fn.DataTable.ext.pager.numbers_length;
        var half = Math.floor( buttons / 2 );

        var _range = function ( len, start ){
            var end;

            if ( typeof start === "undefined" ){
                start = 0;
                end = len;

            } else {
                end = start;
                start = len;
            }

            var out = [];
            for ( var i = start ; i < end; i++ ){ out.push(i); }

            return out;
        };


        if ( pages <= buttons ) {
            numbers = _range( 0, pages );

        } else if ( page <= half ) {
            numbers = _range( 0, buttons);

        } else if ( page >= pages - 1 - half ) {
            numbers = _range( pages - buttons, pages );

        } else {
            numbers = _range( page - half, page + half + 1);
        }

        numbers.DT_el = 'span';

        return [ 'first', 'previous', numbers, 'next', 'last' ];
    };

    $(document).on("click", ".recruit_status", function () {
        currentStatus = $(this).data('id');
		dataTableRecruit.draw();
    });

	$(document).on("click", "#recruit_search_button", function () {
		currentStatus = 5;
		currentJobSeeker = $("#job_seeker").val();
        currentSearchDate = $("#search_date").val();
		currentKeyword = $("#keyword").val();
		dataTableRecruit.draw();
	});

	$(document).on("change", ".sort_recruit", function () {
		dataTableRecruit.draw();
	});

	window.onkeydown = function(event){
		var keyCode = event.keyCode;
		if (keyCode == 13) {
			$("#recruit_search_button").trigger('click');
			return false;
		}
	}

	$('#dataTable-recruit tbody').on( 'click', 'td', function () {
		let index = dataTableRecruit.cell( this ).index();
		let obj = $(this);

		if (obj.find('div').length && index.column > 2) {
			let dataDiv = obj.parent().find('td:nth-child(3) div');
			let id = dataDiv.data('id');
			location.href = g_baseURL + '/company/recruit/' + id;
		}
	});
});
