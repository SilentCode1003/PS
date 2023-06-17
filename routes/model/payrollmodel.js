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
    });
  });

  return dataResult;
};

exports.MasterRoleType = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      rolecode: key.mrt_rolecode,
      rolename: key.mrt_rolename,
      status: key.mrt_status,
      createdby: key.mrt_createdby,
      createddate: key.mrt_createddate,
    });
  });

  return dataResult;
};

exports.MasterAccessType = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      accesscode: key.mat_accesscode,
      accessname: key.mat_accessname,
      status: key.mat_status,
      createdby: key.mat_createdby,
      createddate: key.mat_createddate,
    });
  });

  return dataResult;
};

exports.MasterPosition = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      positioncode: key.mp_positioncode,
      positionname: key.mp_positionname,
      status: key.mp_status,
      createdby: key.mp_createdby,
      createddate: key.mp_createddate,
    });
  });

  return dataResult;
};

exports.MasterDepartment = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      departmentcode: key.md_departmentcode,
      departmentname: key.md_departmentname,
      status: key.md_status,
      createdby: key.md_createdby,
      createddate: key.md_createddate,
    });
  });

  return dataResult;
};

exports.MasterEmployee = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      systemid: key.me_systemid,
      employeeid: key.me_employeeid,
      firstname: key.me_firstname,
      middlename: key.me_middlename,
      lastname: key.me_lastname,
      username: key.me_username,
      password: key.me_password,
      position: key.me_position,
      department: key.me_department,
      contactnumber: key.me_contactnumber,
      email: key.me_email,
      status: key.me_status,
      createdby: key.me_createdby,
      createddate: key.me_createddate,
    });
  });

  return dataResult;
};

exports.TimeRecord = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      employeeid: key.tr_employeeid,
      date: key.tr_date,
      startime: key.tr_starttime,
      starttimelocation: key.tr_starttimelocation,
      endtime: key.tr_endtime,
      endtimelocation: key.tr_endtimelocation,
      starttimedevice: key.tr_starttimedevice,
      endtimedevice: key.tr_endtimedevice,
      status: key.tr_status,
    });
  });

  return dataResult;
};

exports.EmployeeGovernmentIdDetails = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      employeeid: key.egid_employeeid,
      sss: key.egid_sss,
      ssscontribution: key.egid_ssscontribution,
      hdmf: key.egid_hdmf,
      hdmfcontribution: key.egid_hdmfcontribution,
      philhealth: key.egid_philhealth,
      philhealthcontribution: key.egid_philhealthcontribution,
      status: key.egid_status,
      createdby: key.egid_createdby,
      createddate: key.egid_createddate,
    });
  });

  return dataResult;
};

exports.EmployeeAllowance = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      employeeid: key.ea_employeeid,
      allowance: key.ea_allowance,
      status: key.ea_status,
      createdby: key.ea_createdby,
      createddate: key.ea_createddate,
    });
  });

  return dataResult;
};

exports.EmployeeDeductionDetails = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      employeeid: key.edd_employeeid,
      late: key.edd_late,
      absent: key.edd_absent,
      sss: key.edd_sss,
      hdmf: key.edd_hdmf,
      philhealth: key.edd_philhealth,
      cashadvance: key.edd_cashadvance,
      loan: key.edd_loan,
      tax: key.edd_tax,
      payrolldate: key.edd_payrolldate,
      cutoffdate: key.edd_cutoffdate,
    });
  });

  return dataResult;
};

exports.EmployeeSalary = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      employeeid: key.es_employeeid,
      firstname: key.es_firstname,
      middlename: key.es_middlename,
      lastname: key.es_lastname,
      department: key.es_department,
      position: key.es_position,
      dailyrate: key.es_dailyrate,
      monthlysalary: key.es_monthlysalary,
      updateby: key.es_updateby,
      updateddate: key.es_updateddate,
      status: key.es_status,
      createdby: key.es_createdby,
      createddate: key.es_createddate,
    });
  });

  return dataResult;
};

exports.PayrollDetail = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      detailid: key.pd_detailid,
      employeeid: key.pd_employeeid,
      payrolldate: key.pd_payrolldate,
      datecovered: key.pd_datecovered,
      absences: key.pd_absences,
      late: key.pd_late,
      undertime: key.pd_undertime,
      allowance: key.pd_allowance,
      cashadvance: key.pd_cashadvance,
      sss: key.pd_sss,
      sssloan: key.pd_sssloan,
      philhealth: key.pd_philhealth,
      hmdf: key.pd_hmdf,
      tax: key.pd_tax,
      status: key.pd_status,
      createdby: key.pd_createdby,
      createddate: key.pd_createddate,
    });
  });

  return dataResult;
};

exports.TileLogs = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      logid: key.tl_logid,
      employeeid: key.tl_employeeid,
      type: key.tl_type,
      date: key.tl_date,
      time: key.tl_time,
      latitude: key.tl_latitude,
      longitude: key.tl_longitude,
    });
  });

  return dataResult;
};
