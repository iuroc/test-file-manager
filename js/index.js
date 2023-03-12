var root_file_id = now_file_id = 0
var request_getParentFileId = $.ajax()
var uris = [] // 记录路径
var selects_file_id = [] // 选中的文件列表

/**
 * 加载文件夹中的文件/文件夹列表
 * @param {string} parent_id 文件夹ID
 * @param {string} order 加载过程的类型  newLoad: 新加载  refresh: 刷新列表
 */
function getFileList(parent_id, order, file_name) {
    $.ajax({
        method: 'get',
        url: 'api/getFileList.php',
        data: {
            parent_id: parent_id
        },
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                now_file_id = parent_id
                if (order == 'newLoad') {
                    uris.push(file_name)
                }
                var html = ''
                uris.forEach(item => {
                    html += item + ' / '
                })
                $('.uris').html(html)
                if (data.result.length == 0) {
                    $('.fileList').html('<div style="padding: 20px;">文件夹为空</div>')
                    return
                }
                var dirHtml = fileHtml = ''
                data.result.forEach(item => {
                    if (item.type) {
                        dirHtml += '<div class="list-item list-item-dir" data-type="1" data-file_id="' + item.file_id + '">' + item.file_name + '</div>'
                    } else {
                        fileHtml += '<div class="list-item list-item-file" data-type="0" data-file_id="' + item.file_id + '">' + item.file_name + '</div>'
                    }
                })
                $('.fileList').html(dirHtml + fileHtml)
                $('.list-item-dir').unbind().click(function () {
                    var file_id = $(this).data('file_id')
                    var file_name = $(this).text()
                    getFileList(file_id, 'newLoad', file_name)
                })
                addMunuEvent()
            }
        }
    })
}

/**
 * 新增文件/文件夹
 * @param {int} type 0: 文件  1: 文件夹
 */
function addFile(type) {
    var file_name = $('input.file_name').val()
    if (!file_name) {
        return
    }
    $.ajax({
        method: 'get',
        url: 'api/addFile.php',
        data: {
            file_name: file_name,
            parent_id: now_file_id,
            type: type
        },
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                $('input.file_name').val('')
                getFileList(now_file_id, 'refresh')
            } else {
                alert(data.msg)
            }
        }
    })
}
$(document).ready(function () {
    getFileList(root_file_id, 'newLoad', '根目录')
    $('.last-dir').click(function () {
        if (now_file_id == 0) {
            return
        }
        request_getParentFileId.abort()
        request_getParentFileId = $.ajax({
            method: 'get',
            url: 'api/getParentFileId.php',
            data: {
                file_id: now_file_id
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    uris.splice(-1)
                    getFileList(data.result, 'refresh')
                }
            }
        })
    })
    $(document).bind('contextmenu', function (e) {
        return false
    }).click(function () {
        $('.menu').hide()
    })
    $('.menu').click(function () {
        return false
    })
})

/**
 * 绑定右键菜单事件
 */
function addMunuEvent() {
    $('.list-item').bind('contextmenu', function (e) {
        var type = $(this).data('type')
        var file_id = $(this).data('file_id')
        if (type == 0) {
            var html = '<div class="item move">移动文件</div>\
                        <div class="item delete">删除文件</div>'
        } else {
            var html = '<div class="item move">移动文件夹</div>\
                        <div class="item delete">删除文件夹</div>'
        }
        $('.menu').html(html)
        var x = e.pageX
        var y = e.pageY
        var ele_x = 150 // 菜单宽度
        var ele_y = 85 // 菜单高度
        if (window.innerWidth - x < ele_x) {
            x = window.innerWidth - ele_x
        }
        if (window.innerHeight - y < ele_y) {
            y = window.innerHeight - ele_y
        }
        $('.menu').css({
            'display': 'block',
            'top': y,
            'left': x
        })
        $('.menu .delete').unbind().click(function () {
            $('.menu').hide()
            $.ajax({
                method: 'get',
                url: 'api/deleteFile.php',
                data: {
                    file_id: file_id
                },
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                success: function (data) {
                    if (data.code == 200) {
                        getFileList(now_file_id, 'refresh')
                    } else {
                        alert(data.msg)
                    }
                }
            })
        })
        $('.menu .move').unbind().click(function () {
            $('.menu').hide()
            $('.paste').show()
            selects_file_id = [file_id]
        })
    })
    $('.paste').unbind().click(function () {
        $.ajax({
            method: 'get',
            url: 'api/moveFile.php',
            data: {
                file_id: selects_file_id[0],
                paste_to: now_file_id
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    getFileList(now_file_id, 'refresh')
                    $('.paste').hide()
                    selects_file_id = []
                } else {
                    alert(data.msg)
                }
            }
        })
    })
}