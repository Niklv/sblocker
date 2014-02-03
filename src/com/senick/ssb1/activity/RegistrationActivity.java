package com.senick.ssb1.activity;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.senick.ssb1.R;
import com.senick.ssb1.db.DbHelper;
import com.senick.ssb1.db.VariableContract;
import com.senick.ssb1.utils.ServerTaskAsync;

public class RegistrationActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.layout_registration);
		return;
	}
	
	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.btnInitDatabase:
			{
				DbHelper dbHelper = new DbHelper(this);
				dbHelper.initTables();
			}
			break;
		case R.id.btnRequestRegistration:
			if (isConnected()) {
				EditText etPhone = (EditText)findViewById(R.id.etPhone);
			    String ownerNumber = etPhone.getText().toString();		    
				DbHelper dbHelper = new DbHelper(this);
				String serverIp = dbHelper.getVariable(VariableContract.Variables.SERVER_IP);
				String serverPort = dbHelper.getVariable(VariableContract.Variables.SERVER_PORT);
				String method = dbHelper.getVariable(VariableContract.Variables.SERVER_METHOD_CODE);
				
				String params = "ph=" + ownerNumber;
				
				View tvServerResult = findViewById(R.id.tvServerRegResult);
				ServerTaskAsync serverTask = new ServerTaskAsync();
				serverTask.setOutputView(tvServerResult);
				serverTask.setTaskType(ServerTaskAsync.TaskType.REQUEST_CODE);
				serverTask.execute("GET", "http://" + serverIp + ":" + serverPort + "/" + method + "?" + params);
			}
			break;
		case R.id.btnConfirmRegistration:
			if (isConnected()) {
				EditText etPhone = (EditText)findViewById(R.id.etPhone);
			    String ownerNumber = etPhone.getText().toString();
				DbHelper dbHelper = new DbHelper(this);
				String serverIp = dbHelper.getVariable(VariableContract.Variables.SERVER_IP);
				String serverPort = dbHelper.getVariable(VariableContract.Variables.SERVER_PORT);
				String method = dbHelper.getVariable(VariableContract.Variables.SERVER_METHOD_CODE);
				
				EditText etRegCode = (EditText)findViewById(R.id.etRegCode);
				String regCode = etRegCode.getText().toString();
				
				String params = "ph=" + ownerNumber + "&code=" + regCode;
				
				View tvServerResult = findViewById(R.id.tvServerRegResult);
				ServerTaskAsync serverTask = new ServerTaskAsync();
				serverTask.setOutputView(tvServerResult);
				serverTask.setTaskType(ServerTaskAsync.TaskType.CONFIRM_CODE);
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
