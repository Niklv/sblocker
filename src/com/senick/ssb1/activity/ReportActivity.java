package com.senick.ssb1.activity;

import android.app.Activity;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.senick.ssb1.R;
import com.senick.ssb1.db.DbHelper;
import com.senick.ssb1.db.VariableContract;
import com.senick.ssb1.utils.ServerTaskAsync;

public class ReportActivity  extends Activity {
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.layout_report);
		return;
	}
	
	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.btnReport:
			if (isConnected()) {
				EditText etPhone = (EditText)findViewById(R.id.etPhoneReport);
			    String reportedNumber = etPhone.getText().toString();		    
				DbHelper dbHelper = new DbHelper(this);
				String serverIp = dbHelper.getVariable(VariableContract.Variables.SERVER_IP);
				String serverPort = dbHelper.getVariable(VariableContract.Variables.SERVER_PORT);
				String method = dbHelper.getVariable(VariableContract.Variables.SERVER_METHOD_REPORT);
				
				String params = "bl=" + reportedNumber;
				
				View tvServerResult = findViewById(R.id.tvServerReportResult);
				ServerTaskAsync serverTask = new ServerTaskAsync();
				serverTask.setOutputView(tvServerResult);
				serverTask.setTaskType(ServerTaskAsync.TaskType.REPORT);
				serverTask.execute("POST", "http://" + serverIp + ":" + serverPort + "/" + method + "?" + params);
			}
			break;
		default:
			break;
		}
		return;
	}
	
	public boolean isConnected() {
		ConnectivityManager connMgr = (ConnectivityManager) getSystemService(Activity.CONNECTIVITY_SERVICE);
		NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
		if (networkInfo != null && networkInfo.isConnected()) 
		    return true;
		else
		    return false;   
    }
}

