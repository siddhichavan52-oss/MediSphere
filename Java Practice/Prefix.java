class Solution {
    public String longestCommonPrefix(String[] strs) {
        if(strs==null || strs.length==0)
        {
            return"";
        }
        String a=strs[0];
        for(int i=1;i<strs.length;i++)
        {
            while(!strs[i].startsWith(a))
            {
                a=a.substring(0,a.length()-1);
                if(a.isEmpty())
                {
                    return"";
                }
            }
        }
        return a;
    }
}
class Prefix
{
    public static void main(String[] args) 
    {
        Solution obj1=new Solution();
        String[] strs={"flower","flow","flight"};
        System.out.println(obj1.longestCommonPrefix(strs));
    }
}