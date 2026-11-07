from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/pdf/chek-list-gotovnosti-k-pk-fsa-2026.pdf"
PUBLIC = ROOT / "public/pdf/chek-list-gotovnosti-k-pk-fsa-2026.pdf"
FONT_REGULAR = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
FONT_BOLD = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")

NAVY = colors.HexColor("#12362E")
MINT = colors.HexColor("#35DCA7")
INK = colors.HexColor("#17231F")
MUTED = colors.HexColor("#5E746D")
LINE = colors.HexColor("#CED9D5")
SOFT = colors.HexColor("#F3F7F5")
MAGENTA = colors.HexColor("#8B2F6B")


pdfmetrics.registerFont(TTFont("Roknord", str(FONT_REGULAR)))
pdfmetrics.registerFont(TTFont("Roknord-Bold", str(FONT_BOLD)))


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 18 * mm, width, 18 * mm, fill=1, stroke=0)
    canvas.setFillColor(MINT)
    canvas.setFont("Roknord-Bold", 12)
    canvas.drawString(16 * mm, height - 11.5 * mm, "РОКНОРД")
    canvas.setFillColor(colors.white)
    canvas.setFont("Roknord", 8)
    canvas.drawRightString(width - 16 * mm, height - 11.5 * mm, "Чек-лист подготовки к подтверждению компетентности")
    canvas.setStrokeColor(LINE)
    canvas.line(16 * mm, 13 * mm, width - 16 * mm, 13 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Roknord", 7.5)
    canvas.drawString(16 * mm, 8 * mm, "roknord.ru · ООО «РОКНОРД» · ИНН 7807406530")
    canvas.drawRightString(width - 16 * mm, 8 * mm, f"{doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleRN", fontName="Roknord-Bold", fontSize=27, leading=30, textColor=NAVY, spaceAfter=8 * mm))
styles.add(ParagraphStyle(name="LeadRN", fontName="Roknord", fontSize=11, leading=16, textColor=MUTED, spaceAfter=7 * mm))
styles.add(ParagraphStyle(name="H1RN", fontName="Roknord-Bold", fontSize=20, leading=24, textColor=NAVY, spaceAfter=5 * mm))
styles.add(ParagraphStyle(name="H2RN", fontName="Roknord-Bold", fontSize=13, leading=16, textColor=NAVY, spaceBefore=3 * mm, spaceAfter=3 * mm))
styles.add(ParagraphStyle(name="BodyRN", fontName="Roknord", fontSize=9.5, leading=14, textColor=INK))
styles.add(ParagraphStyle(name="SmallRN", fontName="Roknord", fontSize=8, leading=11, textColor=MUTED))
styles.add(ParagraphStyle(name="KickerRN", fontName="Roknord-Bold", fontSize=8, leading=10, textColor=MAGENTA, spaceAfter=3 * mm))


sections = [
    ("1. Процедура и исходные сведения", [
        "Проверены регистрационный номер, статус и сведения об аккредитованном лице в реестре Росаккредитации.",
        "Уточнены вид процедуры, заявленная дата и границы предстоящей оценки.",
        "Назначен ответственный координатор, утверждён календарный план подготовки.",
        "Сформирован единый перечень документов, записей и доказательств для проверки.",
    ]),
    ("2. Область аккредитации", [
        "Каждая позиция области сопоставлена с методикой, оборудованием, помещением и компетентным персоналом.",
        "Исключены дубли, устаревшие формулировки и позиции, которые организация фактически не подтверждает.",
        "Проверены адреса мест осуществления деятельности и их связь с заявленными работами.",
        "Подготовлены основания для актуализации, сокращения или расширения области при необходимости.",
    ]),
    ("3. Система менеджмента", [
        "Политики и процедуры соответствуют фактической структуре, ролям и процессам организации.",
        "Документы управляются по утверждённым правилам: версии, согласование, доступ и архивирование.",
        "Проведены внутренний аудит и анализ со стороны руководства; решения подтверждены записями.",
        "Риски, жалобы, несоответствия и корректирующие действия ведутся как связанные процессы.",
    ]),
    ("4. Персонал и компетентность", [
        "Для каждой функции определены требования к образованию, опыту, обучению и полномочиям.",
        "Компетентность подтверждена наблюдениями, проверками навыков и результатами реальной работы.",
        "Полномочия на методы и оборудование актуальны, датированы и согласованы с областью.",
        "Записи об обучении, стажировке и периодической оценке доступны и непротиворечивы.",
    ]),
    ("5. Оборудование и метрологическая прослеживаемость", [
        "Реестр оборудования совпадает с фактически используемыми средствами и местами их эксплуатации.",
        "Поверка, калибровка, техническое обслуживание и промежуточные проверки выполняются в срок.",
        "Критерии пригодности и действия при выходе оборудования за пределы установлены и применяются.",
        "Прослеживаемость результатов подтверждается документами и сохраняется в архиве записей.",
    ]),
    ("6. Методики, отбор и результаты", [
        "Используются актуальные версии методик; изменения внедрены и подтверждены записями.",
        "Верификация или валидация выполнена в требуемом объёме до применения метода.",
        "Отбор, транспортирование, хранение и идентификация объектов контролируются на каждом этапе.",
        "Протоколы содержат обязательные сведения, а первичные записи позволяют восстановить ход работы.",
    ]),
    ("7. Доказательная база", [
        "По каждому требованию собрана связка «требование → процедура → запись → доказательство».",
        "Выборка дел охватывает разные методы, сотрудников, оборудование и периоды деятельности.",
        "Данные в документах, ФГИС и фактической практике сопоставлены; расхождения зафиксированы.",
        "Доступы, резервное копирование и сроки хранения обеспечивают сохранность доказательств.",
    ]),
    ("8. Несоответствия и готовность команды", [
        "Для выявленных проблем определены причина, масштаб, риск, действие, ответственный и срок.",
        "Результативность корректирующих действий проверена, а не только заявлена в плане.",
        "Сотрудники понимают свои процессы и могут показать применяемые записи без подготовки «на ходу».",
        "Проведена итоговая проверка готовности с выборкой доказательств и разбором вопросов команды.",
    ]),
]


def checklist_table(items):
    rows = []
    for item in items:
        rows.append([Paragraph("□", styles["H2RN"]), Paragraph(item, styles["BodyRN"]), Paragraph("Комментарий: ____________________", styles["SmallRN"])])
    table = Table(rows, colWidths=[8 * mm, 112 * mm, 48 * mm], repeatRows=0)
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return table


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
PUBLIC.parent.mkdir(parents=True, exist_ok=True)
doc = BaseDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm, topMargin=26 * mm, bottomMargin=18 * mm, title="Чек-лист готовности к подтверждению компетентности", author="ООО РОКНОРД")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
doc.addPageTemplates([PageTemplate(id="Roknord", frames=[frame], onPage=header_footer)])

story = [
    Spacer(1, 7 * mm),
    Paragraph("ПРАКТИЧЕСКИЙ МАТЕРИАЛ · 2026", styles["KickerRN"]),
    Paragraph("Чек-лист готовности к подтверждению компетентности", styles["TitleRN"]),
    Paragraph("Рабочая проверка СМК, области аккредитации, ресурсов, записей и доказательств перед процедурой Росаккредитации.", styles["LeadRN"]),
]

info = Table([
    [Paragraph("Организация", styles["SmallRN"]), ""],
    [Paragraph("Номер в реестре", styles["SmallRN"]), ""],
    [Paragraph("Процедура и дата", styles["SmallRN"]), ""],
    [Paragraph("Ответственный", styles["SmallRN"]), ""],
], colWidths=[45 * mm, 123 * mm], rowHeights=[12 * mm] * 4)
info.setStyle(TableStyle([("BOX", (0,0), (-1,-1), .7, LINE), ("INNERGRID", (0,0), (-1,-1), .5, LINE), ("BACKGROUND", (0,0), (0,-1), SOFT), ("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("LEFTPADDING", (0,0), (-1,-1), 8)]))
story += [info, Spacer(1, 7 * mm), Paragraph("Как использовать", styles["H2RN"]), Paragraph("Отметьте подтверждённые пункты и зафиксируйте ссылку на конкретную запись или документ. Пустой пункт — повод проверить процесс глубже, а не автоматический вывод о несоответствии.", styles["BodyRN"]), PageBreak()]

for index, (title, items) in enumerate(sections):
    story += [Paragraph(title, styles["H1RN"]), checklist_table(items), Spacer(1, 7 * mm)]
    if index in {1, 3, 5}:
        story.append(PageBreak())

story += [
    PageBreak(),
    Paragraph("Итоговая карта действий", styles["H1RN"]),
    Table([
        [Paragraph("Приоритет", styles["SmallRN"]), Paragraph("Риск / расхождение", styles["SmallRN"]), Paragraph("Действие и доказательство", styles["SmallRN"]), Paragraph("Срок", styles["SmallRN"])],
        *[["", "", "", ""] for _ in range(6)],
    ], colWidths=[25 * mm, 50 * mm, 70 * mm, 23 * mm], rowHeights=[10 * mm] + [17 * mm] * 6, style=TableStyle([("BOX",(0,0),(-1,-1),.7,LINE),("INNERGRID",(0,0),(-1,-1),.5,LINE),("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),6)])),
    Spacer(1, 7 * mm),
    Paragraph("Важно", styles["H2RN"]),
    Paragraph("Чек-лист предназначен для внутренней подготовки и не заменяет анализ применимых требований, официальных сведений Росаккредитации и обстоятельств конкретной процедуры. РОКНОРД — независимая экспертная организация и не является государственным органом или официальным представителем Росаккредитации.", styles["SmallRN"]),
    Spacer(1, 5 * mm),
    Paragraph("Нужна независимая проверка? roknord.ru · hello@roknord.ru · +7 (812) 38-98-178", styles["BodyRN"]),
]

doc.build(story)
PUBLIC.write_bytes(OUTPUT.read_bytes())
print(OUTPUT)
