from logging import exception
import frappe
from frappe.utils import getdate
from frappe.utils import get_datetime
import json
import os, sys
from datetime import datetime, date
from employee.api import check_permission

now = datetime.now()
datetimeNow = now.strftime("%Y-%m-%d %H:%M :%s")


def makeJson(data):
        json_object = json.dumps(data)
        print(json_object)
        return json_object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

def get_context(context):
    
      
        context.attendane_data = {}
        context.Break = 0
        context.punch_in = 0
        #  context.morning_punch_out = 0
        #  context.afternoon_punch_in = 0
        context.punch_out = 0
        context.total_work_time = 0
        context.date = frappe.utils.getdate()
        context.datetime = frappe.utils.get_datetime()
        response = check_permission()
        context.employee_name = ""
        if(not response["relocate"]):
          
            attenance_db_request = frappe.db.sql(""" SELECT status,  DATE_FORMAT(attendance_date, '%m-%d-%Y') FROM `tabAttendance` WHERE (employee_name='Natnael Lemma')""", as_dict=0)
            context.attendane_data = makeJson(attenance_db_request)
            
            ##############################data fetch for analysis############################
            uid= frappe.session.user    
            email = frappe.db.get_value('User', {'username': uid}, ['email'])
            employee = frappe.db.get_value('Employee', {'user_id': uid}, ['employee'])
            context.employee_name = frappe.db.get_value('Employee', {'user_id': uid}, ['employee_name'])
            company = frappe.db.get_value('Employee', {'user_id': uid}, ['company'])

            Values  = {'email': email, 'date': context.date, 'employee': employee}

            last_punch_db_response = frappe.db.sql("""
            SELECT A.last_punch FROM `tabAttendance` AS A  WHERE (A.employee = %(employee)s)
            AND (attendance_date=%(date)s);""",values=Values, as_dict=0)

            attendance_name_db_response = frappe.db.sql("""
            SELECT A.name FROM `tabAttendance` AS A  WHERE (A.employee = %(employee)s)
            AND (attendance_date=%(date)s);""",values=Values, as_dict=0)

            first_unpack = []
            attendance_first = []
            last_punch= 0
            attendance_name = 0


            for item in  last_punch_db_response:
                first_unpack = item

            for item in first_unpack:              # to unpack the array value from database 
                last_punch = item
            
            for item in  attendance_name_db_response:
                attendance_first= item

            for item in attendance_first:        # to unpack the array value from database 
                attendance_name = item

            if(last_punch):

                doc = frappe.get_doc('Attendance',attendance_name)
                context.punch_in = doc.in_time
                #context.morning_punch_out = doc.out_time_morning
                #context.afternoon_punch_in = doc.in_time_afternoon
                context.punch_out = doc.out_time
            
               

                context.Break = ""
                try:
                
                    if(context.punch_out):
                        context.total_work_time = context.punch_out - (context.punch_in)
                    else:
                        context.total_work_time = context.datetime - (context.punch_in)
                except:
                    context.total_work_time = 0
            ##############################data fetch for analysis############################
                
        return context


