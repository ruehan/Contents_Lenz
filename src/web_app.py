"""
Flask 기반 웹 인터페이스 모듈
"""

import os
import tempfile
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename

from src.models.openai_client import OpenAIClient
from src.utils.file_handler import FileHandler
from src.config import SUMMARY_LENGTHS, SUMMARY_FORMATS, SUPPORTED_LANGUAGES, SUPPORTED_TEXT_FORMATS, SUPPORTED_DOCUMENT_FORMATS

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 제한

# OpenAI 클라이언트 초기화
openai_client = None
try:
    openai_client = OpenAIClient()
except ValueError as e:
    print(f"OpenAI API 초기화 오류: {str(e)}")

@app.route('/')
def index():
    """메인 페이지"""
    return render_template('index.html', 
                          summary_lengths=SUMMARY_LENGTHS,
                          summary_formats=SUMMARY_FORMATS,
                          supported_languages=SUPPORTED_LANGUAGES)

@app.route('/summarize', methods=['POST'])
def summarize():
    """텍스트 요약 API"""
    if not openai_client:
        return jsonify({"error": "OpenAI API 키가 설정되지 않았습니다."}), 500
    
    # 요약 옵션 가져오기
    length = request.form.get('length', 'medium')
    format = request.form.get('format', 'paragraph')
    language = request.form.get('language', 'auto')
    
    # 텍스트 입력 방식 확인
    input_type = request.form.get('input_type', 'text')
    
    if input_type == 'text':
        # 직접 텍스트 입력
        text = request.form.get('text', '').strip()
        if not text:
            return jsonify({"error": "요약할 텍스트를 입력하세요."}), 400
    
    elif input_type == 'file':
        # 파일 업로드
        if 'file' not in request.files:
            return jsonify({"error": "파일이 업로드되지 않았습니다."}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "파일이 선택되지 않았습니다."}), 400
        
        # 파일 확장자 확인
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in SUPPORTED_TEXT_FORMATS + SUPPORTED_DOCUMENT_FORMATS:
            return jsonify({"error": f"지원하지 않는 파일 형식입니다: {file_ext}"}), 400
        
        # 파일 저장 및 읽기
        try:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            text = FileHandler.read_file(filepath)
            
            # 임시 파일 삭제
            os.remove(filepath)
        
        except Exception as e:
            return jsonify({"error": f"파일 처리 중 오류가 발생했습니다: {str(e)}"}), 500
    
    else:
        return jsonify({"error": "잘못된 입력 유형입니다."}), 400
    
    # 언어 감지 (자동 모드인 경우)
    detected_language = None
    if language == 'auto':
        try:
            detected_language = openai_client.detect_language(text)
        except Exception as e:
            print(f"언어 감지 중 오류가 발생했습니다: {str(e)}")
    
    # 텍스트 요약
    try:
        summary = openai_client.summarize_text(text, length, format, language)
        
        response_data = {
            "summary": summary
        }
        
        if detected_language:
            response_data["detected_language"] = detected_language
            response_data["detected_language_name"] = SUPPORTED_LANGUAGES.get(detected_language, detected_language)
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({"error": f"요약 중 오류가 발생했습니다: {str(e)}"}), 500

@app.route('/download', methods=['POST'])
def download():
    """요약 결과 다운로드"""
    summary = request.form.get('summary', '').strip()
    if not summary:
        return jsonify({"error": "다운로드할 요약 결과가 없습니다."}), 400
    
    file_format = request.form.get('format', '.txt')
    if file_format not in ['.txt', '.docx']:
        file_format = '.txt'  # 기본값
    
    try:
        # 임시 파일에 저장
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_format)
        temp_file.close()
        
        # 파일 저장
        FileHandler.save_text(summary, os.path.splitext(temp_file.name)[0], file_format)
        
        # 파일 다운로드
        return send_file(temp_file.name, 
                         as_attachment=True, 
                         download_name=f"summary{file_format}")
    
    except Exception as e:
        return jsonify({"error": f"파일 다운로드 중 오류가 발생했습니다: {str(e)}"}), 500

@app.route('/detect-language', methods=['POST'])
def detect_language():
    """텍스트 언어 감지 API"""
    if not openai_client:
        return jsonify({"error": "OpenAI API 키가 설정되지 않았습니다."}), 500
    
    text = request.form.get('text', '').strip()
    if not text:
        return jsonify({"error": "언어를 감지할 텍스트를 입력하세요."}), 400
    
    try:
        detected_language = openai_client.detect_language(text)
        return jsonify({
            "language": detected_language,
            "language_name": SUPPORTED_LANGUAGES.get(detected_language, detected_language)
        })
    
    except Exception as e:
        return jsonify({"error": f"언어 감지 중 오류가 발생했습니다: {str(e)}"}), 500

def run_web_app(host='0.0.0.0', port=5000, debug=False):
    """웹 애플리케이션 실행"""
    app.run(host=host, port=port, debug=debug) 