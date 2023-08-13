The FNN algorithm is a commonly used neural network algorithm, and creating illustrations of neural network architectures is often time-consuming. This tool provides a graphical visualization capability using the D3 JavaScript library. Users can generate corresponding multi-layer views by customizing Excel data.
Step 1: Construct data in Excel, as shown in demo_1.xls.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/0c1121de-b4ba-4c71-9b65-0b2429f78d45)

Step 2: Generate display data and connection information by executing ConvertExcel2JsonData.py.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/5e65910d-cb8b-4c8e-a32d-93151d621be5)

Step 3: Launch run.py to display the data on the web page at http://localhost:8080/index.html.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/aecff148-4908-4de0-baa8-f30a314272b9)

Additionally, it supports view switching and node inspection.
![image](https://github.com/zhuguofusxjm/FNN-Vis-Tool/assets/142020046/5316a646-e7c0-4dc5-8c24-4cc628001dc4)

I hope this tool can save time for machine learning researchers and also serve as an educational tool in certain scenarios.
