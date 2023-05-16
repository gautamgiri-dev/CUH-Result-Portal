from fpdf import FPDF
from werkzeug.utils  import secure_filename
import os
from typing import Any

def generate_pdf(payload: dict[str, Any], output_path: str, assets_path: str) -> str:
    pdf = FPDF('p', 'mm', 'A4')
    pdf.add_page()
    pdf.set_font('helvetica', size=14)

    roll, stud_name, session = payload['roll'], payload['student_name'], payload['uploadId']['session']['session']
    dept, pgm, sem = payload['uploadId']['programme']['department']['name'], payload['uploadId']['programme']['name'], payload['uploadId']['semester']

    marks, subject = payload['marks'], payload['subject']
    subject_codes = subject['codes']
    subject_names = subject['names']

    remark = "PASS"

    table_format = '''<table border="1">
        <thead>
          <tr>
            <th width="20%">Subject Code</th>
            <th width="50%"><font size="8">Subject Name</font></th>
            <th width="15%">Marks Obtained</th>
            <th width="15%">Total Marks</th>
          </tr>
        </thead>
        <tbody>
          %%data%%
        </tbody>
      </table>'''
    
    row_format = '''
        <tr>
            <td>{code}</td>
            <td>{name}</td>
            <td align="center">{marks}</td>
            <td align="center">{max_marks}</td>
        </tr>
    '''

    factor = 25.4/72

    pdf.image(os.path.join(assets_path, 'cuh_logo.png'),w=100*factor,h=114*factor, x=247*factor, y=36*factor)

    pdf.set_font(size=25)    
    pdf.set_y(163*factor)
    pdf.cell(w=pdf.epw, txt="Central University of Haryana", align='C')

    pdf.set_font(size=16)
    pdf.set_y(190*factor)
    pdf.cell(w=pdf.epw, txt="NAAC Accredited 'A' Grade University", align='C')

    pdf.set_font(size=20, style='B')
    pdf.set_y(230*factor)
    pdf.cell(w=pdf.epw, txt="PROVISIONAL SCORE CARD", align='C')

    pdf.set_font(size=12, style='')

    def get_pos(n):
        dist, base = 20, 280 - 20
        return (base + (dist * n))*factor

    pdf.text(x=39*factor, y=get_pos(1), txt="Roll No:")
    pdf.set_font(style='B')
    pdf.text(x=147*factor, y=get_pos(1), txt=f"{roll}")

    pdf.set_font(style='')
    pdf.text(x=39*factor, y=get_pos(2), txt="Student Name:")
    pdf.set_font(style='B')
    pdf.text(x=147*factor, y=get_pos(2), txt=f"{stud_name}".upper())

    pdf.set_font(style='')
    pdf.text(x=39*factor, y=get_pos(3), txt="Session:")
    pdf.set_font(style='B')
    pdf.text(x=147*factor, y=get_pos(3), txt=f"{session}")

    pdf.set_font(style='')
    pdf.text(x=39*factor, y=get_pos(4), txt="Department:")
    pdf.set_font(style='B')
    pdf.text(x=147*factor, y=get_pos(4), txt=f"{dept}")

    pdf.set_font(style='')
    pdf.text(x=39*factor, y=get_pos(5), txt="Programme:")
    pdf.set_font(style='B')
    pdf.text(x=147*factor, y=get_pos(5), txt=f"{pgm}")

    pdf.set_font(style='')
    pdf.text(x=39*factor, y=get_pos(6), txt="Semester:")
    pdf.set_font(style='B')
    pdf.text(x=147*factor, y=get_pos(6), txt=f"{sem}")

    pdf.set_font(style='')
    pdf.text(x=39*factor, y=get_pos(7), txt="Result:")
    pdf.set_font(style='B')
    pdf.text(x=147*factor, y=get_pos(7), txt=f"{remark}")
    
    pdf.set_font(size=10, style='')

    rows = []

    for i in range(len(subject_codes)):
        code = subject_codes[i]
        name = subject_names[i]
        max_marks = 15 if 'lab' in name.lower() else 30
        mark = marks[i]

        row = row_format.format(code=code, name=name, max_marks=max_marks, marks=mark)
        rows.append(row)

    # line_height = 0
    
    table_format = table_format.replace('%%data%%', '\n'.join(rows))
    # table_format = table_format.replace('%%lh%%', str(line_height))

    pdf.set_x(39*factor)
    pdf.set_y(400*factor)

    pdf.write_html(table_format, table_line_separators=True)

    # pdf.set_font(size=12)
    # pdf.text(x=468*factor, y=700*factor, txt="Result:")
    # pdf.set_font(style='B')
    # pdf.text(x=525*factor, y=600*factor, txt=f"{remark}")

    filename = f'{stud_name}-{pgm}-sem-{sem}-result.pdf'

    filepath = os.path.join(output_path, secure_filename(filename))

    pdf.output(filepath)

    return filename