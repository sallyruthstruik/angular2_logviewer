import os
from setuptools import setup

from pip.req import parse_requirements

setup(
    name='mongo_logviewer',
    version='0.22',
    url='https://github.com/sallyruthstruik/mongo_logviewer',
    license='BSD',
    description='Web dashboard for viewing logs in MongoDB',
    long_description="",
    author='Stas Kaledin',
    author_email='staskaledin@gmail.com',
    packages=[
        dirpath
        for dirpath, dirnames, filenames in os.walk("mongo_logviewer")
        if os.path.exists(os.path.join(dirpath, '__init__.py'))
    ],
    data_files=[[dirpath, [dirpath + "/" + f for f in fnames]] for dirpath, _, fnames in os.walk("dist")],
    scripts=["mongo_logviewer/logviewer.py"],
    install_requires=[
        str(ir.req) for ir in parse_requirements("requirements.txt", session='hack')
    ],
    zip_safe=False,
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Topic :: Internet :: WWW/HTTP',
    ]
)
