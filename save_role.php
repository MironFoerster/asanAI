<?php
    include('functions.php');

    $status["status"] = "error";
    if(array_key_exists("role", $_GET)) {
        if(array_key_exists("username", $_GET)) {
            $role_number = get_single_value_from_query("select id from tfd_db.role_table where name = ".esc($_GET["role"]));
            if($role_number != "") {
                if(get_single_value_from_query("select username from tfd_db.login where username =".esc($_GET["username"])) != "") {
                    $query = "update tfd_db.login set role_id = ".esc($role_number)." where username = ".esc($_GET["username"]);
                    run_query($query);
                    $status = ["status" => "ok", "msg" => "Role changed successful."];
                } else {
                    $status["msg"] = "This user doesn't exist.";
                }
            } else {
                $status["msg"] = "This is not a role.";
            }
        } else {
            $status["msg"] = "Please select a user";
        }
    } else {
        $status["msg"] = "Please select a role.";
    }

    header('Content-Type: application/json');
    print json_encode($status);
?>