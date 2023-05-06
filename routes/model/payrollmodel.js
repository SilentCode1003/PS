exports.MasterUser = (data) => {
    let dataResult = []; 

    data.forEach((key, item) => {

        dataResult.push({
            usercode: key.mu_usercode,
            fullname: key.mu_fullname,
            username: key.mu_username,
            password: key.mu_password,
            roletype: key.mu_roletype,
            accesstype: key.mu_accesstype,
            status: key.mu_status,
            createdby: key.mu_createdby,
            createddate: key.mu_createddate,
        })
    });

    return dataResult;
}
 
exports.MasterRoleType = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            rolecode: key.mrt_rolecode,
            rolename: key.mrt_rolename,
            status: key.mrt_status,
            createdby: key.mrt_createdby,
            createddate: key.mrt_createddate, 
        })
    });
 
    return dataResult;
}
 
exports.MasterAccessType = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            accesscode: key.mat_accesscode,
            accessname: key.mat_accessname,
            status: key.mat_status,
            createdby: key.mat_createdby,
            createddate: key.mat_createddate, 
        })
    });

    return dataResult;
}

exports.MasterPosition = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            positioncode: key.mp_positioncode,
            positionname: key.mp_positionname,
            status: key.mp_status,
            createdby: key.mp_createdby,
            createddate: key.mp_createddate, 
        })
    });

    return dataResult;
} 

exports.MasterDepartment = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            departmentcode: key.md_departmentcode,
            departmentname: key.md_departmentname,
            status: key.md_status,
            createdby: key.md_createdby,
            createddate: key.md_createddate, 
        })
    });

    return dataResult;
}
 
exports.MasterEmployee = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            systemid: key.me_systemid,
            employeeid: key.me_employeeid,
            firstname: key.me_firstname,
            middlename: key.me_middlename,
            lastname: key.me_lastname,
            position: key.me_position,
            department: key.me_department,
            contactnumber: key.me_contactnumber,
            email: key.me_email,
            status: key.me_status,
            createdby: key.me_createdby,
            createddate: key.me_createddate,
        })
    });

    return dataResult;
}



