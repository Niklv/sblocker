package com.senick.ssb1.db;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

public class DbHelper extends SQLiteOpenHelper {

	private static final String LOG_TAG = "DbHelper";
	
	public static final int DATABASE_VERSION = 1;
	public static final String DATABASE_NAME = "SSB.db";
	
	public DbHelper (Context context) {
		super (context, DATABASE_NAME, null, DATABASE_VERSION);
	}
	
	public DbHelper (Context context, int version) {
		super (context, DATABASE_NAME, null, version);
	}
	
	@Override
	public void onCreate(SQLiteDatabase db) {
		Log.v(LOG_TAG, "onCreate");
		db.execSQL(VariableContract.CREATE_TABLE);
		db.execSQL(SenderContract.CREATE_TABLE);
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		Log.v(LOG_TAG, "onUpgrade");
		db.execSQL(VariableContract.DROP_TABLE);
		db.execSQL(SenderContract.DROP_TABLE);
		onCreate(db);
	}

	public void deleteSenderEntries() {
		SQLiteDatabase db = this.getWritableDatabase();
		try {
			db.execSQL(SenderContract.DELETE_ENTRIES);
			Log.v(LOG_TAG, "sender_delete_entries: success");
		} catch (Exception e) {
			Log.v(LOG_TAG, "charge_delete_entries: exception");
		}
	}
	
	public void deleteVariableEntries() {
		SQLiteDatabase db = this.getWritableDatabase();
		try {
			db.execSQL(VariableContract.DELETE_ENTRIES);
			Log.v(LOG_TAG, "variable_delete_entries: success");
		} catch (Exception e) {
			Log.v(LOG_TAG, "variable_delete_entries: exception");
		}
	}
	
	public void updateDatabase(String strDb) {
		try {
			deleteSenderEntries();
			JSONObject jsonObjDb = new JSONObject(strDb);
			JSONArray jsonArrDb = jsonObjDb.getJSONArray("blacklist");
			for (int i = 0; i < jsonArrDb.length(); i++) {
		        JSONObject jsonObjItem = jsonArrDb.getJSONObject(i);
		        String number = jsonObjItem.getString("ph");
		        String date = jsonObjItem.getString("createdAt");
		        addSender(number, date);
		      }
			Log.v(LOG_TAG, "json parsed");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void initTables() {
		Log.v(LOG_TAG, "init tables");
    	SQLiteDatabase db = getWritableDatabase();
    	ContentValues senderValues = new ContentValues();
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "89165798450");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "block");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "spam");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "zadolbal");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363014323");
    	long id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, senderValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	    	
    	senderValues = new ContentValues();
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "Kupi_Avto");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "block");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "thief");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "zablockirovan");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363030386");
    	id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, senderValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);

    	senderValues = new ContentValues();
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "900");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "allow");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "bank-info number");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "shluz sberbanka");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363201109");
    	id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, senderValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	
    	senderValues = new ContentValues();
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, "s.itsoft.ru");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, "block");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, "spam");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, "shluz spama");
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, "1382363201109");
    	id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, senderValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	
    	
    	ContentValues variableValues = new ContentValues();
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_NAME, VariableContract.Variables.SERVER_IP);
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_VALUE, "192.168.0.60");
    	id = db.insert(VariableContract.VariableEntry.TABLE_NAME, null, variableValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	
    	variableValues = new ContentValues();
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_NAME, VariableContract.Variables.SERVER_PORT);
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_VALUE, "20301");
    	id = db.insert(VariableContract.VariableEntry.TABLE_NAME, null, variableValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	
    	variableValues = new ContentValues();
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_NAME, VariableContract.Variables.SERVER_METHOD_CODE);
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_VALUE, "code");
    	id = db.insert(VariableContract.VariableEntry.TABLE_NAME, null, variableValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	
    	variableValues = new ContentValues();
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_NAME, VariableContract.Variables.SERVER_METHOD_DB);
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_VALUE, "db");
    	id = db.insert(VariableContract.VariableEntry.TABLE_NAME, null, variableValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	
    	variableValues = new ContentValues();
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_NAME, VariableContract.Variables.SERVER_METHOD_REPORT);
    	variableValues.put(VariableContract.VariableEntry.COLUMN_NAME_VALUE, "report");
    	id = db.insert(VariableContract.VariableEntry.TABLE_NAME, null, variableValues);
    	Log.v(LOG_TAG, "inserted entry, id = " + id);
    	    	
	}
	
	public long addSender(String number, String date) {
		SQLiteDatabase db = getWritableDatabase();
    	ContentValues senderValues = new ContentValues();
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, number);
    	senderValues.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, date);
    	long id = db.insert(SenderContract.SenderEntry.TABLE_NAME, null, senderValues);
    	return id;
	}
	
	public ArrayList<Map<String,Object>> getAllSenders() {
		Log.v(LOG_TAG, "getAllSenders");
		SQLiteDatabase db = getReadableDatabase();
		Cursor c = db.query(
				SenderContract.SenderEntry.TABLE_NAME,
				null,
				null,
				null,
				null,
				null,
				null
				);
		int count = c.getCount();
		Log.v(LOG_TAG, "count of received senders = " + count);
		if (count <= 0) {
			ArrayList<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
			return result;
		}
		ArrayList<Map<String,Object>> result = new ArrayList<Map<String,Object>>(count);
		c.moveToFirst();
		for (int i=0; i < count; i++) {
			Map<String,Object> m = new HashMap<String,Object>();
			String number = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_NUMBER));
			String type = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_TYPE));
			String reason = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_REASON));
			String description = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION));
			String date = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_DATE));
			m.put(SenderContract.SenderEntry.COLUMN_NAME_NUMBER, number);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_TYPE, type);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_REASON, reason);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_DESCRIPTION, description);
			m.put(SenderContract.SenderEntry.COLUMN_NAME_DATE, date);
			result.add(m);
			c.moveToNext();
		}
		return result;
	}
	
	public String getVariable(String name) {
		try {
			SQLiteDatabase db = getReadableDatabase();
		    String selection = 	VariableContract.VariableEntry.COLUMN_NAME_NAME + " = '" + name + "';";
		    String[] cols = {VariableContract.VariableEntry._ID, VariableContract.VariableEntry.COLUMN_NAME_VALUE};
			Cursor c = db.query(
					VariableContract.VariableEntry.TABLE_NAME,
					cols,
					selection,
					null,
					null,
					null,
					null
					);
			int count = c.getCount();
			if ( count != 1) {
				return null;
			}
			c.moveToFirst();
			String value = c.getString(c.getColumnIndexOrThrow(VariableContract.VariableEntry.COLUMN_NAME_VALUE));
			return value;
		} catch (Exception e) {
			Log.v(LOG_TAG, "getVariable: expection");
			return null;
		}
	}
	
	public boolean isSpam(String sender) {
		return true;/*
		try {
			SQLiteDatabase db = getReadableDatabase();
		    String selection = 	SenderContract.SenderEntry.COLUMN_NAME_NUMBER + " = '" + sender + "' AND " +
		    					SenderContract.SenderEntry.COLUMN_NAME_TYPE + " = 'block'";
		    String[] cols = {SenderContract.SenderEntry._ID};
			Cursor c = db.query(
					SenderContract.SenderEntry.TABLE_NAME,
					cols,
					selection,
					null,
					null,
					null,
					null
					);
			int count = c.getCount();
			if (count <= 0) {
				return false;
			}
			c.moveToFirst();
			for (int i=0; i < count; i++) {
				String number = c.getString(c.getColumnIndexOrThrow(SenderContract.SenderEntry.COLUMN_NAME_NUMBER));
				if ( number.equals(sender)) {
					return true;
				}
				c.moveToNext();
			}
			return false;
		} catch (Exception e) {
			Log.v(LOG_TAG, "getVariable: expection");
			return false;
		}*/
	}
}
