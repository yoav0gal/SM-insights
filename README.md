# SM-insights

A tool aimed to provide influencers with comments insights to better engage with their followers

### Setting up a BERTopic Environment and Git for Clean Notebooks

Steps to create a conda environment for BERTopic and configure Git to automatically clean Jupyter Notebooks (`.ipynb`) before committing.

#### 1. Create and Activate Conda Environment

```bash
conda create --name BERTopic python=3.12.8 -y
conda activate BERTopic
```

_Note:_ PowerShell might encounter issues with conda activation. Using `cmd.exe` is often more reliable.

#### 2. Install Dependencies

**Option 1: Using `conda` (Slower)**

```
conda install -n BERTopic -c conda-forge --file Notebooks/requirements.txt -y
```

**Option 2: Using `mamba` (Faster - Recommended)**

```
conda install -c conda-forge mamba -y
mamba install --file Notebooks/requirements.txt -y
```

#### 3. Configure Git for Notebook Cleaning

Automatically clean Jupyter Notebooks (remove outputs and metadata) before committing, you need to configure Git attributes and the `nb-clean` filter.

**3.1 Find your Conda Installation Path:**

```
where conda # Windows
which conda # macOS/Linux
```

**3.2 Add the BERTopic Scripts Path to Environment Variables:**

Add the path to the `nb-clean` executable (located within your `BERTopic` environment's `Scripts` or `bin` directory) to your system's PATH environment variable. The typical path is:

- **Windows:** `conda_path\envs\BERTopic\Scripts` (e.g., `C:\Users\YourUser\anaconda3\envs\BERTopic\Scripts`)
- **macOS/Linux:** `conda_path/envs/BERTopic/bin` (e.g., `/Users/youruser/anaconda3/envs/BERTopic/bin`)

**3.3 Restart your computer:**

For the PATH changes to take effect, you _must_ restart your terminal or IDE.

**3.4 Configure the Git Filter:**

```
git config --global filter.nb-clean.clean "nb-clean clean"
git config --global filter.nb-clean.smudge "cat"
```

This ensures that notebooks are automatically cleaned (outputs and metadata removed) when using `git add`.
