# **FNN SVG Display Tool**

The FNN algorithm is a commonly used neural network algorithm, and creating illustrations of neural network architectures is often time-consuming. This tool provides a graphical visualization capability using the D3 JavaScript library. Users can generate corresponding multi-layer views by customizing Excel data.

Step 1: Construct data in Excel, as shown in demo_1.xls.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/0c1121de-b4ba-4c71-9b65-0b2429f78d45)

Step 2: Generate display data and connection information by executing ConvertExcel2JsonData.py.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/5e65910d-cb8b-4c8e-a32d-93151d621be5)

Step 3: Launch run.py to display the data on the web page at http://localhost:8080/index.html.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/d7a318a8-a982-4f80-9aca-9f91b870b26e)

Additionally, it supports view switching and node inspection.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/ce6bdbfe-c6b9-40e0-9c19-78eb4d5e4081)

I hope this tool can save time for machine learning researchers and also serve as an educational tool in certain scenarios.

# **Related**
[**NN-SVG**](https://github.com/alexlenail/NN-SVG)
