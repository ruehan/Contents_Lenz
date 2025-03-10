import sys
import os
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
    QLabel, QPushButton, QTextEdit, QComboBox, QFileDialog, 
    QTabWidget, QSplitter, QMessageBox, QProgressBar, QStatusBar
)
from PyQt6.QtCore import Qt, QThread, pyqtSignal
from PyQt6.QtGui import QFont, QIcon

from src.config import (
    APP_NAME, DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT, 
    DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, SUMMARY_LENGTHS, 
    SUMMARY_FORMATS, SUPPORTED_TEXT_FORMATS, SUPPORTED_DOCUMENT_FORMATS,
    SUPPORTED_OUTPUT_FORMATS
)
from src.models.openai_client import OpenAIClient
from src.utils.file_handler import FileHandler

class SummarizeThread(QThread):
    """요약 작업을 위한 스레드 클래스"""
    
    finished = pyqtSignal(str)  # 요약 완료 시그널
    error = pyqtSignal(str)     # 오류 발생 시그널
    
    def __init__(self, text, length, format):
        super().__init__()
        self.text = text
        self.length = length
        self.format = format
        self.client = OpenAIClient()
    
    def run(self):
        try:
            summary = self.client.summarize_text(self.text, self.length, self.format)
            self.finished.emit(summary)
        except Exception as e:
            self.error.emit(str(e))

class MainWindow(QMainWindow):
    """메인 애플리케이션 창"""
    
    def __init__(self):
        super().__init__()
        
        self.openai_client = None
        self.init_ui()
        
        # OpenAI 클라이언트 초기화 시도
        try:
            self.openai_client = OpenAIClient()
            self.statusBar().showMessage("OpenAI API 연결 성공", 3000)
        except ValueError as e:
            QMessageBox.warning(self, "API 키 오류", str(e))
            self.statusBar().showMessage("OpenAI API 연결 실패: API 키를 설정하세요", 5000)
    
    def init_ui(self):
        """UI 초기화"""
        # 기본 창 설정
        self.setWindowTitle(APP_NAME)
        self.resize(DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT)
        self.setFont(QFont(DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE))
        
        # 중앙 위젯 설정
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 메인 레이아웃
        main_layout = QVBoxLayout(central_widget)
        
        # 스플리터 생성 (입력과 출력 영역 분리)
        splitter = QSplitter(Qt.Orientation.Horizontal)
        main_layout.addWidget(splitter)
        
        # 입력 영역
        input_widget = QWidget()
        input_layout = QVBoxLayout(input_widget)
        
        # 입력 탭 위젯
        input_tabs = QTabWidget()
        input_layout.addWidget(input_tabs)
        
        # 텍스트 입력 탭
        text_input_widget = QWidget()
        text_input_layout = QVBoxLayout(text_input_widget)
        
        text_input_label = QLabel("텍스트 입력:")
        self.text_input = QTextEdit()
        self.text_input.setPlaceholderText("여기에 요약할 텍스트를 입력하세요...")
        
        text_input_layout.addWidget(text_input_label)
        text_input_layout.addWidget(self.text_input)
        
        input_tabs.addTab(text_input_widget, "텍스트 입력")
        
        # 파일 업로드 탭
        file_upload_widget = QWidget()
        file_upload_layout = QVBoxLayout(file_upload_widget)
        
        file_upload_label = QLabel("파일 업로드:")
        file_upload_layout.addWidget(file_upload_label)
        
        file_button_layout = QHBoxLayout()
        self.file_path_label = QLabel("선택된 파일 없음")
        self.file_path_label.setStyleSheet("color: gray;")
        
        browse_button = QPushButton("파일 찾기")
        browse_button.clicked.connect(self.browse_file)
        
        file_button_layout.addWidget(self.file_path_label)
        file_button_layout.addWidget(browse_button)
        
        file_upload_layout.addLayout(file_button_layout)
        file_upload_layout.addStretch()
        
        input_tabs.addTab(file_upload_widget, "파일 업로드")
        
        # 옵션 영역
        options_layout = QHBoxLayout()
        
        # 요약 길이 선택
        length_label = QLabel("요약 길이:")
        self.length_combo = QComboBox()
        for key, value in SUMMARY_LENGTHS.items():
            self.length_combo.addItem(value, key)
        
        # 요약 형식 선택
        format_label = QLabel("요약 형식:")
        self.format_combo = QComboBox()
        for key, value in SUMMARY_FORMATS.items():
            self.format_combo.addItem(value, key)
        
        options_layout.addWidget(length_label)
        options_layout.addWidget(self.length_combo)
        options_layout.addWidget(format_label)
        options_layout.addWidget(self.format_combo)
        
        input_layout.addLayout(options_layout)
        
        # 요약 버튼
        self.summarize_button = QPushButton("요약하기")
        self.summarize_button.clicked.connect(self.summarize_text)
        input_layout.addWidget(self.summarize_button)
        
        # 진행 상태 표시줄
        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 0)  # 불확정 진행 상태
        self.progress_bar.setVisible(False)
        input_layout.addWidget(self.progress_bar)
        
        # 출력 영역
        output_widget = QWidget()
        output_layout = QVBoxLayout(output_widget)
        
        output_label = QLabel("요약 결과:")
        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        self.output_text.setPlaceholderText("요약 결과가 여기에 표시됩니다...")
        
        output_layout.addWidget(output_label)
        output_layout.addWidget(self.output_text)
        
        # 결과 저장 버튼
        save_button = QPushButton("결과 저장")
        save_button.clicked.connect(self.save_result)
        output_layout.addWidget(save_button)
        
        # 스플리터에 위젯 추가
        splitter.addWidget(input_widget)
        splitter.addWidget(output_widget)
        splitter.setSizes([int(DEFAULT_WINDOW_WIDTH/2), int(DEFAULT_WINDOW_WIDTH/2)])
        
        # 상태 표시줄
        self.statusBar().showMessage("준비")
    
    def browse_file(self):
        """파일 선택 대화상자 표시"""
        supported_formats = []
        for fmt in SUPPORTED_TEXT_FORMATS + SUPPORTED_DOCUMENT_FORMATS:
            supported_formats.append(f"*{fmt}")
        
        file_filter = f"지원되는 파일 ({' '.join(supported_formats)})"
        
        file_path, _ = QFileDialog.getOpenFileName(
            self, "파일 선택", "", file_filter
        )
        
        if file_path:
            self.file_path_label.setText(file_path)
            self.file_path_label.setStyleSheet("color: black;")
            
            try:
                # 파일 내용 읽기
                text = FileHandler.read_file(file_path)
                self.text_input.setText(text)
                
                # 텍스트 입력 탭으로 전환
                tab_widget = self.findChild(QTabWidget)
                if tab_widget:
                    tab_widget.setCurrentIndex(0)
                
                self.statusBar().showMessage(f"파일을 성공적으로 로드했습니다: {os.path.basename(file_path)}", 3000)
            
            except Exception as e:
                QMessageBox.critical(self, "파일 로드 오류", str(e))
                self.statusBar().showMessage("파일 로드 실패", 3000)
    
    def summarize_text(self):
        """텍스트 요약 시작"""
        # OpenAI 클라이언트 확인
        if not self.openai_client:
            try:
                self.openai_client = OpenAIClient()
            except ValueError as e:
                QMessageBox.warning(self, "API 키 오류", str(e))
                return
        
        # 입력 텍스트 가져오기
        text = self.text_input.toPlainText().strip()
        if not text:
            QMessageBox.warning(self, "입력 오류", "요약할 텍스트를 입력하세요.")
            return
        
        # 요약 옵션 가져오기
        length = self.length_combo.currentData()
        format = self.format_combo.currentData()
        
        # UI 상태 업데이트
        self.summarize_button.setEnabled(False)
        self.progress_bar.setVisible(True)
        self.statusBar().showMessage("요약 중...")
        
        # 요약 스레드 시작
        self.summarize_thread = SummarizeThread(text, length, format)
        self.summarize_thread.finished.connect(self.on_summarize_finished)
        self.summarize_thread.error.connect(self.on_summarize_error)
        self.summarize_thread.start()
    
    def on_summarize_finished(self, summary):
        """요약 완료 처리"""
        self.output_text.setText(summary)
        self.summarize_button.setEnabled(True)
        self.progress_bar.setVisible(False)
        self.statusBar().showMessage("요약 완료", 3000)
    
    def on_summarize_error(self, error_message):
        """요약 오류 처리"""
        QMessageBox.critical(self, "요약 오류", error_message)
        self.summarize_button.setEnabled(True)
        self.progress_bar.setVisible(False)
        self.statusBar().showMessage("요약 실패", 3000)
    
    def save_result(self):
        """요약 결과 저장"""
        summary = self.output_text.toPlainText().strip()
        if not summary:
            QMessageBox.warning(self, "저장 오류", "저장할 요약 결과가 없습니다.")
            return
        
        # 지원되는 출력 형식 필터 생성
        file_filters = []
        for fmt in SUPPORTED_OUTPUT_FORMATS:
            if fmt == '.txt':
                file_filters.append(f"텍스트 파일 (*{fmt})")
            elif fmt == '.docx':
                file_filters.append(f"Word 문서 (*{fmt})")
            elif fmt == '.pdf':
                file_filters.append(f"PDF 문서 (*{fmt})")
        
        file_filter = ";;".join(file_filters)
        
        # 저장 대화상자 표시
        file_path, selected_filter = QFileDialog.getSaveFileName(
            self, "결과 저장", "summary", file_filter
        )
        
        if file_path:
            try:
                # 선택된 필터에서 파일 형식 추출
                file_format = None
                for fmt in SUPPORTED_OUTPUT_FORMATS:
                    if f"(*{fmt})" in selected_filter:
                        file_format = fmt
                        break
                
                if not file_format:
                    file_format = '.txt'  # 기본값
                
                # 파일 저장
                saved_path = FileHandler.save_text(summary, file_path, file_format)
                QMessageBox.information(self, "저장 완료", f"요약 결과가 저장되었습니다:\n{saved_path}")
                self.statusBar().showMessage(f"파일 저장 완료: {os.path.basename(saved_path)}", 3000)
            
            except Exception as e:
                QMessageBox.critical(self, "저장 오류", str(e))
                self.statusBar().showMessage("파일 저장 실패", 3000) 