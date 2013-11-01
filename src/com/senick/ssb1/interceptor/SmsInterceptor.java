package com.senick.ssb1.interceptor;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.SmsMessage;
import android.util.Log;

import com.senick.ssb1.db.DbHelper;

public class SmsInterceptor extends BroadcastReceiver {

	private static final String LOG_TAG = "SmsInterceptor";

	@Override
	public void onReceive(Context context, Intent intent) {
		Log.v(LOG_TAG, "onReceive");
		Object[] pdus = (Object[]) intent.getExtras().get("pdus");
		if (pdus.length == 0) {
			Log.v(LOG_TAG, "pdus.length = 0");
			return;
		}
		SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdus[0]);
		String sender = smsMessage.getOriginatingAddress();
		Log.v(LOG_TAG, "sender = " + sender);
		DbHelper dbHelper = null;
		try {
			dbHelper = new DbHelper(context);
			if (dbHelper.isSpam(sender)) {
				Log.v(LOG_TAG, "sender is in spam database");
				abortBroadcast();
			}
		} finally {
			if (dbHelper != null) {
				dbHelper.close();
			}
		}
	}
}
