package com.senick.ssb1.activity;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.senick.ssb1.R;
import com.senick.ssb1.db.DbHelper;
import com.senick.ssb1.interceptor.SmsInterceptor;

public class MainActivity extends Activity {

	private static final String LOG_TAG = "MainActivity"; 
	
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_main);
        Button btn = (Button) findViewById(R.id.btnSwitchInterceptor);
        if (switchInterceptor()) {
			btn.setBackgroundColor(getResources().getColor(R.color.red));
		} else {
			btn.setBackgroundColor(getResources().getColor(R.color.white));
		}
	}
	
	public void onClickSwitchInterceptor(View v) {
		setContentView(R.layout.layout_main);
		Button btn = (Button) findViewById(R.id.btnSwitchInterceptor);
		if (switchInterceptor()) {
			btn.setBackgroundColor(getResources().getColor(R.color.red));
		} else {
			btn.setBackgroundColor(getResources().getColor(R.color.white));
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
	
	public void onClickShowDatabase(View v) {
		Intent intent = new Intent(this, SenderListActivity.class);
		startActivity(intent);
	}
	
	public void onClickUpdateDatabase(View v) {
		DbHelper dbHelper = new DbHelper(this);
		dbHelper.deleteEntries();
		dbHelper.initTables();
	}
	
	public void onClickClearDatabase(View v) {
		DbHelper dbHelper = new DbHelper(this);
		dbHelper.deleteEntries();
	}
	
}
