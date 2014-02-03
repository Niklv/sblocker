package com.senick.ssb1.activity;

import java.util.ArrayList;
import java.util.Map;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.senick.ssb1.R;
import com.senick.ssb1.db.DbHelper;
import com.senick.ssb1.db.VariableContract;
import com.senick.ssb1.interceptor.SmsInterceptor;
import com.senick.ssb1.utils.ServerTaskAsync;

public class MainActivity extends Activity {

	private static final String LOG_TAG = "MainActivity"; 
	
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.layout_main);  
		String packageName = getPackageName();
		String receiverComponent = packageName + ".interceptor.SmsInterceptor";
		ComponentName componentName = new ComponentName(packageName, receiverComponent);
		PackageManager packageManager = getPackageManager();
		packageManager.setComponentEnabledSetting(componentName, PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
		Button btn = (Button) findViewById(R.id.btnSwitchInterceptor);
		btn.setBackgroundColor(getResources().getColor(R.color.white));
		
		DbHelper dbHelper = new DbHelper(this);
		//проверка инициализированности и целостности системных данных, обновление
		
		//проверка регистрационных данных
		String regCode = dbHelper.getVariable(VariableContract.Variables.REG_CODE);
		String ownerPhone = dbHelper.getVariable(VariableContract.Variables.OWNER_PHONE);
		if ((regCode == null) || (regCode.isEmpty()) || (ownerPhone == null) ) {
			//Intent intent = new Intent(this, RegistrationActivity.class);
			//startActivity(intent);
			//return;
		}		
	}
	
	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.btnShowDatabase:
			{
				Intent intent = new Intent(this, SenderListActivity.class);
				startActivity(intent);
			}
			break;
		case R.id.btnShowReport:
			{
				Intent intent = new Intent(this, ReportActivity.class);
				startActivity(intent);
			}
			break;
		case R.id.btnRequestDatabase:
			requestDatabase();
			break;
		case R.id.btnUpdateDatabase:
			{
				DbHelper dbHelper = new DbHelper(this);
				dbHelper.deleteVariableEntries();
				dbHelper.deleteSenderEntries();
				dbHelper.initTables();
			}
			break;
		case R.id.btnClearDatabase:
			{
				DbHelper dbHelper = new DbHelper(this);
				dbHelper.deleteVariableEntries();
				dbHelper.deleteSenderEntries();
			}
			break;
		case R.id.btnSwitchInterceptor:
			setContentView(R.layout.layout_main);
			Button btn = (Button) findViewById(R.id.btnSwitchInterceptor);
			if (switchInterceptor()) {
				btn.setBackgroundColor(getResources().getColor(R.color.red));
			} else {
				btn.setBackgroundColor(getResources().getColor(R.color.white));
			}
			break;
		default:
			break;
		}
	}
		
	private boolean switchInterceptor() {
		String packageName = getPackageName();
		String receiverComponent = packageName + ".interceptor.SmsInterceptor";
		ComponentName componentName = new ComponentName(packageName, receiverComponent);
		PackageManager packageManager = getPackageManager();
		boolean enabled = (PackageManager.COMPONENT_ENABLED_STATE_ENABLED == packageManager.getComponentEnabledSetting(componentName));
		if (enabled) {
			packageManager.setComponentEnabledSetting(componentName, PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
			Log.v(LOG_TAG, "interceptor state is = " + packageManager.getComponentEnabledSetting(componentName));
			return false; //interceptor is turned off now
		} else {
			packageManager.setComponentEnabledSetting(componentName, PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
			Log.v(LOG_TAG, "interceptor state is = " + packageManager.getComponentEnabledSetting(componentName));
			return true; //interceptor is turned on now
		}
	}
	
	private boolean requestDatabase() {
		DbHelper dbHelper = new DbHelper(this);
		String serverIp = dbHelper.getVariable(VariableContract.Variables.SERVER_IP);
		String serverPort = dbHelper.getVariable(VariableContract.Variables.SERVER_PORT);
		String method = dbHelper.getVariable(VariableContract.Variables.SERVER_METHOD_DB);
		
		View tvServerResult = findViewById(R.id.tvServerMainResult);
		ServerTaskAsync serverTask = new ServerTaskAsync();
		serverTask.setOutputView(tvServerResult);
		serverTask.setTaskType(ServerTaskAsync.TaskType.REQUEST_DB);
		serverTask.setContext(this);
		serverTask.execute("GET", "http://" + serverIp + ":" + serverPort + "/" + method);
		return true;
	}
}
