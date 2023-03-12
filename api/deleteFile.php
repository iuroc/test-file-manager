<?php

/**
 * 删除文件/文件夹
 */
include './init_db.php';
$file_id = $_GET['file_id'];

/**
 * 删除文件/文件夹
 * @param string $file_id 文件或文件夹ID
 */
function delete($file_id, $db)
{
    $sql = <<<EOF
DELETE FROM `fileList` WHERE `file_id` = '$file_id';
EOF;
    $result = $db->exec($sql);
    if (!$result) {
        die(json_encode(array(
            'code' => 202,
            'msg' => '数据库错误'
        )));
    }
    $sql = <<<EOF
SELECT `file_id` FROM `fileList` WHERE `parent_id` = '$file_id';
EOF;
    $result2 = $db->query($sql);
    while ($row = $result2->fetchArray(SQLITE3_ASSOC)) {
        $file_id = $row['file_id'];
        delete($file_id, $db);
    }
}

delete($file_id, $db);
echo json_encode(array(
    'code' => 200,
    'msg' => '删除成功'
));
