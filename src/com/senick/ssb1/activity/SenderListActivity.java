package com.senick.ssb1.activity;

import java.util.ArrayList;
import java.util.Map;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;
import android.widget.SimpleAdapter;

import com.senick.ssb1.R;
import com.senick.ssb1.db.DbHelper;
import com.senick.ssb1.db.SenderContract;

public class SenderListActivity extends Activity {

	ListView senderListView;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.layout_sender_list);
		DbHelper dbHelper = new DbHelper(this);
		ArrayList<Map<String,Object>> data = dbHelper.getAllSenders();
		String[] from = {	SenderContract.SenderEntry.COLUMN_NAME_NUMBER,
							SenderContract.SenderEntry.COLUMN_NAME_TYPE};
		int[] to = {R.id.senderListTvNumber,
					R.id.senderListTvType};
		SimpleAdapter sAdapter = new SimpleAdapter(this, data, R.layout.sender_item, from, to);
		senderListView = (ListView) findViewById(R.id.senderList);
		senderListView.setAdapter(sAdapter);
	}
}
