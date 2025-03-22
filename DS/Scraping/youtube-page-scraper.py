from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import json
import time
import re
import os

def get_channel_id(url):
    """Extract channel ID from different URL formats"""
    match = re.search(r"@([\w-]+)", url)
    return match.group(1) if match else "youtube_channel"

def scrape_youtube_channel(url):
    # Configure Chrome options
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    
    # Set up WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        driver.get(url)
        print(f"Loading {url}...")

        # Wait for content using explicit wait
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'ytd-rich-item-renderer, ytd-grid-video-renderer'))
        )

        # Scroll to load more videos
        last_height = driver.execute_script("return document.documentElement.scrollHeight")
        for _ in range(3):
            driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
            time.sleep(2)
            new_height = driver.execute_script("return document.documentElement.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        # Parse page content
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Corrected CSS selector
        video_items = soup.select('ytd-rich-item-renderer, ytd-grid-video-renderer')
        print(f"Found {len(video_items)} video containers")

        videos = []
        is_videos_page = '/videos' in url.lower()

        for item in video_items:
            try:
                # Title and URL
                title_tag = item.select_one('#video-title-link, #video-title')
                if not title_tag:
                    continue
                    
                title = title_tag.text.strip()
                video_url = f"https://youtube.com{title_tag['href'].split('&')[0]}"

                # Thumbnail handling
                thumbnail = item.select_one('img.yt-core-image, yt-img-shadow img')
                thumbnail_url = None
                if thumbnail:
                    thumbnail_url = (thumbnail.get('src') or 
                                    thumbnail.get('data-src') or 
                                    thumbnail.get('srcset', '').split(' ')[0])

                # Metadata handling
                views = 'N/A'
                upload_date = 'N/A'

                if is_videos_page:
                    # Handle /videos page structure
                    metadata_line = item.select_one('#metadata-line')
                    if metadata_line:
                        views = metadata_line.select_one('span.inline-metadata-item.style-scope.ytd-video-meta-block:nth-child(3)').text.strip() if metadata_line.select_one('span.inline-metadata-item.style-scope.ytd-video-meta-block:nth-child(3)') else 'N/A'
                        upload_date = metadata_line.select_one('span.inline-metadata-item.style-scope.ytd-video-meta-block + span.inline-metadata-item.style-scope.ytd-video-meta-block').text.strip() if metadata_line.select_one('span.inline-metadata-item.style-scope.ytd-video-meta-block + span.inline-metadata-item.style-scope.ytd-video-meta-block') else 'N/A'
                else:
                    # Handle channel homepage structure
                    meta_container = item.select_one('#metadata-line, .ytd-video-meta-block')
                    if meta_container:
                        metadata = [span.text.strip() for span in meta_container.find_all('span')]
                        views = metadata[0] if len(metadata) > 0 else 'N/A'
                        upload_date = metadata[1] if len(metadata) > 1 else 'N/A'

                # Duration handling
                duration_tag = item.select_one('.badge-shape-wiz__text')
                duration = duration_tag.text.strip() if duration_tag else 'N/A'

                videos.append({
                    'title': title,
                    'url': video_url,
                    'thumbnail': thumbnail_url,
                    'views': views,
                    'upload_date': upload_date,
                    'duration': duration
                })
                
            except Exception as e:
                print(f"Skipping video due to error: {str(e)}")
                continue

        # Create filename
        channel_id = get_channel_id(url)
        filename = f"{channel_id}_videos_{int(time.time())}.json"
        
        # Save results
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(videos, f, ensure_ascii=False, indent=2)
            
        print(f"Data saved to {os.path.abspath(filename)}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
    finally:
        driver.quit()

if __name__ == "__main__":
    # Test with either format:
    CHANNEL_URL = "https://www.youtube.com/@VisualPolitikEN/videos"
    scrape_youtube_channel(CHANNEL_URL)